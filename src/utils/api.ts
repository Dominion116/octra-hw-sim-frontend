const API_BASE_URL = "http://localhost:8000";

export const deviceApi = {
  getStatus: () =>
    fetch(`${API_BASE_URL}/api/device/status`).then((r) => r.json()),

  connect: (deviceType: string) =>
    fetch(`${API_BASE_URL}/api/device/connect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_type: deviceType,
        name: `${
          deviceType.charAt(0).toUpperCase() + deviceType.slice(1)
        } Device`,
      }),
    }).then((r) => r.json()),

  disconnect: () =>
    fetch(`${API_BASE_URL}/api/device/disconnect`, { method: "POST" }).then(
      (r) => r.json()
    ),

  unlock: (pin: string) =>
    fetch(`${API_BASE_URL}/api/device/unlock`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    }).then((r) => r.json()),

  signTransaction: async () => {
    // First check device status
    const statusResponse = await fetch(`${API_BASE_URL}/api/device/status`);
    const status = await statusResponse.json();
    console.log("Device status before signing:", status);

    const response = await fetch(`${API_BASE_URL}/api/transaction/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to_address: "octra1abc123def456ghi789jkl012mno345pqr678stu",
        amount: "10.5",
        fee: "0.001",
      }),
    });

    const result = await response.json();
    console.log("Sign transaction response:", result);

    if (!response.ok) {
      throw new Error(result.detail || "Transaction signing failed");
    }

    return result;
  },

  confirmTransaction: (confirmed: boolean) =>
    fetch(`${API_BASE_URL}/api/transaction/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed }),
    }).then((r) => r.json()),
};
