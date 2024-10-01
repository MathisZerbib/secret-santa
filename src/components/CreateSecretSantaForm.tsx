// // components/CreateSecretSantaForm.tsx

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useRouter } from "next/router";
// import Loader from "./ui/loader";
// import { motion } from "framer-motion";

// export default function CreateSecretSantaForm() {
//   const [manager, setManager] = useState("");
//   const [groupName, setGroupName] = useState("");
//   const [inviteCode, setInviteCode] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [hasPaid, setHasPaid] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const checkPaymentStatus = async () => {
//       try {
//         const response = await fetch("/api/manager/get");
//         if (response.ok) {
//           const data = await response.json();
//           if (data[0]) {
//             setManager(data[0].email);
//             setHasPaid(data[0].hasPaid);
//           }
//         }
//       } catch (error) {
//         console.error("Error checking payment status:", error);
//         setErrorMessage("Failed to fetch manager information.");
//       }
//     };
//     checkPaymentStatus();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");
//     console.log("manager: " + manager);
//     console.log("groupName: " + groupName);
//     try {
//       const response = await fetch("/api/create-group", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: groupName,
//           managerEmail: manager,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to create group");
//       }

//       const result = await response.json();

//       if (result.inviteCode) {
//         setInviteCode(result.inviteCode);
//         setSuccessMessage("Secret Santa group created successfully!");
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorMessage(
//         err instanceof Error ? err.message : "An unexpected error occurred"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = () => {
//     router.push("/payment");
//   };

//   if (!hasPaid) {
//     return (
//       <Card className="max-w-md mx-auto my-10 p-6 text-center shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-2xl font-semibold">
//             Payment Required
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="mb-4 text-gray-500">
//             To create a Secret Santa group, you need to complete the payment.
//           </p>
//           <Button onClick={handlePayment} disabled={loading} className="w-full">
//             {loading ? <Loader /> : "Proceed to Payment"}
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-10">
//       <Card className="max-w-lg w-full mx-auto p-6 shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-3xl font-semibold text-center">
//             Create Your Secret Santa Group
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <Input
//               placeholder="Group Name"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               className="mb-4"
//               disabled={loading}
//             />
//             <Input
//               value={manager}
//               onChange={(e) => setManager(e.target.value)}
//               disabled={true}
//               className="mb-4"
//               placeholder="Manager Email"
//             />
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={loading || !groupName || !manager}
//             >
//               {loading ? <Loader /> : "Create Group"}
//             </Button>

//             {errorMessage && (
//               <motion.div
//                 className="mt-6 bg-red-100 p-4 rounded-md"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <p className="text-red-700">{errorMessage}</p>
//               </motion.div>
//             )}

//             {successMessage && (
//               <motion.div
//                 className="mt-6 bg-green-100 p-4 rounded-md"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <p className="text-green-700">{successMessage}</p>
//                 <p className="text-lg mt-2">
//                   Invite Code: <strong>{inviteCode}</strong>
//                 </p>
//               </motion.div>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
