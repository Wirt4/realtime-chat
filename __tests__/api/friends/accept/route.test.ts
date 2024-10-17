import { POST } from "@/app/api/friends/accept/route";

describe('/api/friends/accept', () => {
    beforeEach(() => {
        fetchMock.resetMocks(); // Ensure fresh mocks
    });

    test('POST should run without throwing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

        const req = new Request('http://localhost/api/friends/accept', {
            method: 'POST',
            body: JSON.stringify({ someData: 'value' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(req);
    });
});
