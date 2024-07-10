import { expect } from "chai";

describe("stam test suite", () => {
    describe("Test array get sorted", () => {
        it("should sort array by name", () => {
            const names = ["a", "c", "v", "b", "a"];
            expect(names.sort()).to.deep.equal(['a', 'a', 'b', 'c', 'v']);
        });
    });
});