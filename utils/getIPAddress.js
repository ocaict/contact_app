import os from "os";
import dns from "dns";

export function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = "";

  // Iterate through the network interfaces to find a non-internal IPv4 address
  for (const interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName];
    for (const iface of interfaceInfo) {
      if (iface.family === "IPv4" && !iface.internal) {
        ipAddress = iface.address;
        break;
      }
    }
    if (ipAddress) break;
  }

  // If no external IPv4 address was found, use DNS to get the public IP address
  /*  if (!ipAddress) {
    dns.resolve4("example.com", (err, addresses) => {
      if (err) {
        console.error("Failed to retrieve IP address:", err);
      } else {
        ipAddress = addresses[0];
      }
    });
  } */

  return ipAddress ? ipAddress : "localhost";
}
