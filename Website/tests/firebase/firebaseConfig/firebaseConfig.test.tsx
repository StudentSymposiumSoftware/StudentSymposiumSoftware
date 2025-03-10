import { expect, it } from "vitest";

import { storage } from "../../../src/firebase/firebaseConfig";

it('Firebase Config is setup', () => {
    expect(storage).toBeDefined();
    expect(typeof storage).toBe('object');
});