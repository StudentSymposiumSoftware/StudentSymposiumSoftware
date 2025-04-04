import "./AdminPage.css"

// Firebase Imports
import { storage, database, authentication } from "../../firebase/firebaseConfig";
import { ref as dbRef, onValue } from "firebase/database";
import { uploadBytes, ref as storageRef } from "firebase/storage";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth"

// React Imports
import { useState, useEffect } from "react";

/* v8 ignore start */
export function AuthAdmin() {
    function uploadFile(file) {
        var year = document.getElementById("year").value;
        year = year == ""? new Date().getFullYear() : year;
        if (file == null) {
            alert("Please select a file to upload.");
            return;
        }
        const fileRef = storageRef(storage, `symposium/${year}/${year}-upload.csv`);
        uploadBytes(fileRef, file).then(() => {
            alert("File uploaded successfully!");
        }).catch((error) => {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        });
    }
    
    return (
        <div className="text-center flex flex-col items-center">
            <div className="mb-[10px]">
                <div className="font-bold text-[26px]">Symposium Year End File Upload Utility</div>
                <div className="font-bold text-[18px]">Please Upload The Excel File Here</div>
            </div>
            <form className="flex flex-col items-center">
                <input type="text" id="year" name="year" placeholder={"Year (Default: "+ new Date().getFullYear()+")"} className="block p-2 bg-white text-black rounded-md mb-5"/>
                <input type="file" id="file" name="file" accept=".csv" className="hidden" onChange={(e) => uploadFile(e.target.files[0])}/>
                <label for="file" className="button mb-2 text-[20px] cursor-pointer bg-white text-black rounded-md p-2">Upload .csv Symposium File</label>
            </form>
        </div>
    )
}

export function Loading() {  
    return (
        <div>
            <h1>Loading...</h1>
        </div>
    )
}

export function AdminPage() {
    const [authUser, authLoading] = useAuthState(authentication) // auth user object (used to obtain other user object)
    const [page, setPage] = useState("loading");
    useEffect(() => {
        if (authUser && authLoading === false) {
            onValue(dbRef(database, `users/${authUser.uid}`), (userData) => {
                userData = userData.val();
                if (userData != null && userData.authorized) {
                    setPage("admin")
                } else {
                    window.location.href = "/";
                }
            });
        } else if (authLoading === false) {
            signInWithRedirect(authentication, new GoogleAuthProvider()).then((result) => {
                console.log("Signed in as:", result.user.displayName);
            }).catch((error) => {
                console.error("Error signing in:", error);
            }
            );
            setPage("loading");
        }
    }, [authLoading]);
    return (
        <main>
            {page === "admin" && <AuthAdmin />}
            {page === "loading" && <Loading />}
        </main>
    )
}

export default AdminPage;
/* v8 ignore stop */