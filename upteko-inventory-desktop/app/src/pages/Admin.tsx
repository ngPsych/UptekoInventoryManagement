import React from 'react';
import { NavigationBar } from '../components/NavBar/NavBar';
import { useRequireAuth } from "../hooks/useRequireAuth"

export default function AdminPage() {


    useRequireAuth();

    return (
        <NavigationBar />
    );
}