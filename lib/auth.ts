import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // Check if the session cookie exists
    const sessionToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("net-auth.session-token="));

    console.log(document.cookie)

    if (sessionToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return { isLoggedIn, username, companyName };
}
