import rk4Step from './rk4.js'; // Adjust path if needed

function almostEqual(a, b, tolerance = 1e-5) {
    return Math.abs(a - b) < tolerance;
}

// Test 1: Spring at rest (x = 0, vx = 0)
{
    const state = [0, 0, 10, 0, 1]; // [x, vx, k, restLength, m]
    const dt = 0.1;
    const nextState = rk4Step(state, dt);
    console.log("Test 1:", almostEqual(nextState[0], 0) && almostEqual(nextState[1], 0) ? "PASS" : "FAIL");
}

// Test 2: Spring displaced (x = 1, vx = 0) should accelerate toward rest
{
    const state = [1, 0, 10, 0, 1];
    const dt = 0.1;
    const nextState = rk4Step(state, dt);
    console.log("Test 2:", nextState[1] < 0 ? "PASS" : "FAIL"); // should have negative velocity
}

// Test 3: Moving initially (vx = 1)
{
    const state = [0, 1, 10, 0, 1];
    const dt = 0.1;
    const nextState = rk4Step(state, dt);
    console.log("Test 3:", nextState[0] > 0 ? "PASS" : "FAIL"); // position should increase
}

// Test 4: Moving away from rest (x = 1, vx = 1), velocity should decrease
{
    const state = [1, 1, 10, 0, 1];
    const dt = 0.1;
    const nextState = rk4Step(state, dt);
    console.log("Test 4:", nextState[1] < 1 ? "PASS" : "FAIL");
}

// Test 5: Zero spring constant (k = 0), should move with constant velocity
{
    const state = [0, 1, 0, 0, 1];
    const dt = 0.1;
    const nextState = rk4Step(state, dt);
    console.log("Test 5:", almostEqual(nextState[1], 1) ? "PASS" : "FAIL");
}

// Test 6: Zero mass (edge case), should throw error or crash
{
    const state = [1, 0, 10, 0, 0];
    const dt = 0.1;
    try {
        console.log(rk4Step(state, dt))
    } catch (e) {
        console.log("Test 6: PASS");
    }
}
