import { baseUrl, handleAPIResponseError } from "./common.js";


function deleteAccount(userId) {
    // let userId = sessionStorage.getItem("user_id");

    console.log(`delete user with id ${userId}`);
    if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
    };
    if (confirm("Are you sure you want to delete your bookie account?")) {
        fetch(`${baseUrl}/users/${userId}`, {
        method: "DELETE",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                alert("User deleted");
                sessionStorage.removeItem("user_id");
                window.location = "index.html"
            } else {
                handleAPIResponseError(data.error);
            }
        })
        .catch(handleAPIResponseError);
    }
};
