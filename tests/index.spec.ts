import {fetch, testsConfig} from "../scripts/jest.setup";

describe("Client", () => {
    beforeAll(async() => {
        await page.goto(testsConfig.host);
    });
    it(`should be titled "Test vuetouch"`, () => {
        expect(page.title()).resolves.toMatch("Test vuetouch");
    });
});