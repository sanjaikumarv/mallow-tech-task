"use client";

import axios from "axios";

export async function makeApiCall<D>(url: string, method = "GET", data?: D) {
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": "reqres-free-v1", // Replace with your actual API key if needed
    }
    try {
        const response = await axios({
            url: `https://reqres.in/api${url}`,
            method,
            headers,
            data,
        })
        console.log(`API Call: ${method} ${url}`, response.data.token);
        switch (method) {
            case 'POST':
                return {
                    id: Date.now(), // Generate a temporary ID
                    ...data,
                    token: response.data.token, // Assuming the response contains a token
                }
            case 'PUT':
                return data
            case 'DELETE':
                return data
            case 'GET':
                return response.data.data || []
            default:
                break;
        }
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || "API call failed");
        }
        throw new Error("API call failed");
    }

    // Ensure function always returns a value of type R
    throw new Error("Unhandled API call method or missing return value");
}
