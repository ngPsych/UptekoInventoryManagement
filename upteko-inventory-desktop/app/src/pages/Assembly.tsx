import React, { useState } from 'react';
import { NavigationBar } from '../components/NavBar/NavBar';
import { useRequireAuth } from "../hooks/useRequireAuth"
import { CreateNewAssemblyPopupCard } from '../components/PopupCard/PopupCard';

export default function AssemblyPage() {
    useRequireAuth();

    const [showCreateNewAssemblyPopup, setShowCreateNewAssemblyPupop] = useState(false);

    return (
        <div>
            <NavigationBar />
            <button onClick={() => setShowCreateNewAssemblyPupop(true)}>Create new assembly</button>

            {showCreateNewAssemblyPopup && (
                <CreateNewAssemblyPopupCard
                    onClose={() => setShowCreateNewAssemblyPupop(false)}
                />
            )}
        </div>
    );
}