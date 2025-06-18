export default function rk4Step(state, params, vdotFunc, xdotFunc, ref, dt, time) {
    const { beta, f, omega, omega0 } = params;
    let drivingForceValue = undefined;
    let springForceValue = undefined;
    let dragForceValue = undefined;

    let error = false

    let drivingForceEquation = '';
    let springForceEquation = '';
    let dragForceEquation = '';



    function splitTopLevel(str) {
        let terms = [];
        let depth = 0;
        let last = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '(' || str[i] === '{') depth++;
            if (str[i] === ')' || str[i] === '}') depth--;
            if ((str[i] === '+' || str[i] === '-') && depth === 0 && i !== 0) {
                terms.push(str.slice(last, i).trim());
                last = i;
            }
        }
        terms.push(str.slice(last).trim());
        return terms;
    }


    if (typeof vdotFunc === 'string') {
        const terms = splitTopLevel(vdotFunc);
        let drivingForceParts = [];
        let springForceParts = [];
        let dragForceParts = [];

        terms.forEach(term => {
            // Match terms like X*(...)
            const prodParenMatch = term.match(/^\s*([+-]?\s*\d+(?:\.\d+)?|[a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\*|\\cdot)\s*(?:\\left)?[\(\{]([^]*?)(?:\\right)?[\)\}]/);
            if (prodParenMatch) {
                const coeff = prodParenMatch[1].replace(/\s+/g, '');
                const inner = prodParenMatch[2];

                // Split inside the parentheses by +/-
                const innerTerms = inner.split(/(?=[+-])/g).map(t => t.trim());

                // Keep only those without x or v
                const drivingInner = innerTerms.filter(t => !/[xv]/.test(t));
                const springInner = innerTerms.filter(t => /x/.test(t) && !/v/.test(t));
                const dragInner = innerTerms.filter(t => /v/.test(t));

                if (drivingInner.length > 0) {
                    // Remove any leading + signs from the first term
                    let joinedInner = drivingInner.join('');
                    joinedInner = joinedInner.replace(/^\+/, '');

                    // Reconstruct as coeff*(sum)
                    drivingForceParts.push(`${coeff}*(${joinedInner})`);
                }

                // Process spring force terms (with x)
                if (springInner.length > 0) {
                    let joinedInner = springInner.join('').replace(/^\+/, '');
                    springForceParts.push(`${coeff}*(${joinedInner})`);
                }

                // Process drag force terms (with v)
                if (dragInner.length > 0) {
                    let joinedInner = dragInner.join('').replace(/^\+/, '');
                    dragForceParts.push(`${coeff}*(${joinedInner})`);
                }
            } else {
                if (!/[xv]/.test(term)) {
                    drivingForceParts.push(term);
                } else if (/x/.test(term) && !/v/.test(term)) {
                    springForceParts.push(term);
                } else if (/v/.test(term)) {
                    dragForceParts.push(term);
                }
            }
        });

        if (drivingForceParts.length > 0) {
            let drivingForceEquation = drivingForceParts.join('  ').replace(/^\s*\+/, '').trim();

            drivingForceValue = evaluatex(drivingForceEquation, { latex: true })({
                t: time,
                beta,
                f,
                omega,
                omega0
            });
        }


        if (springForceParts.length > 0) {
            let springForceEquation = springForceParts.join('  ').replace(/^\s*\+/, '').trim();
            try {
                springForceValue = evaluatex(springForceEquation, { latex: true })({
                    t: time, beta, f, omega, omega0, x: state[0], v: state[1]
                });
            }
            catch (e) {
                error = true;
            }

        }

        // Evaluate drag force
        if (dragForceParts.length > 0) {
            let dragForceEquation = dragForceParts.join('  ').replace(/^\s*\+/, '').trim();
            try {
                dragForceValue = evaluatex(dragForceEquation, { latex: true })({
                    t: time, beta, f, omega, omega0, x: state[0], v: state[1]
                });

            }
            catch (e) {
                error = true;
            }
        }
    }




    function derivatives([x, v], t) {
        let xdot, vdot;
        try {
            xdot = !ref ? evaluatex(xdotFunc, { latex: true })({
                x,
                v,
                t,
                beta,
                f,
                omega,
                omega0
            }) : v;

            vdot = !ref ? evaluatex(vdotFunc, { latex: true })({
                x: x,
                v: v,
                t: t,
                beta,
                f,
                omega,
                omega0
            }) : (-(omega0 ** 2)) * x - beta * v + f * Math.sin(omega * t);
        }
        catch (e) {
            error = true;
        }






        return [xdot, vdot];

    }

    // RK4 steps
    const k1 = derivatives(state, time);
    const k2 = derivatives(
        [state[0] + dt / 2 * k1[0], state[1] + dt / 2 * k1[1]],
        time + dt / 2
    );
    const k3 = derivatives(
        [state[0] + dt / 2 * k2[0], state[1] + dt / 2 * k2[1]],
        time + dt / 2
    );
    const k4 = derivatives(
        [state[0] + dt * k3[0], state[1] + dt * k3[1]],
        time + dt
    );

    // Update state using RK4 formula
    const xNext = state[0] + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
    const vNext = state[1] + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    const [, vdotNext] = derivatives([xNext, vNext], time + dt);





    return ref ? [xNext, vNext, vdotNext, -beta * vNext, -(omega0 ** 2) * xNext, f * Math.sin(omega * (time + dt))] :
        [xNext, vNext, vdotNext, drivingForceValue, springForceValue, dragForceValue];

}

