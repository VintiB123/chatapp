import { createContext, useContext, useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import { io } from "socket.io-client";

import { HOST } from "@/utils/constants";

const SocketContext = createContext(null);
export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  // useEffect(() => {
  //   if (userInfo) {
  //     socket.current = io(HOST, {
  //       withCredentials: true,
  //       query: { userId: userInfo.id },
  //     });

  //     socket.current.on("connect", () => {
  //       console.log("Connected to socket server");
  //     });
  //     return () => {
  //       socket.current.disconnect();
  //     };
  //   }
  // }, [userInfo]);

  useEffect(() => {
    console.log("Attempting socket connection, userId:", userInfo?.id);
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      // Add error and connection handling
      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
