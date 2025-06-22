import React, { useEffect, useState, useRef } from "react";
import { User, Star, Camera } from "lucide-react";
import { Card, CardContent, CardHeader } from "../UI/Card";
import { ActionButton } from "../UI/ActionButton";

interface ProfileSidebarProps {
    isEditing: boolean;
}

export function ProfileSidebar({ isEditing }: ProfileSidebarProps) {
    const [rating, setRating] = useState<number>(0);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchRating() {
            try {
                const res = await fetch(
                    "http://localhost:3333/providers/ratings/summary",
					{
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setRating(Number(data.average_rating));
                setTotalReviews(Number(data.total_reviews));
            } catch {
                setRating(0);
                setTotalReviews(0);
            }
        }
        async function fetchAvatar() {
            try {
                const res = await fetch("http://localhost:3333/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error();
                const data = await res.json();
                // O campo avatar está em data.user.avatar
                setAvatarUrl(data.user?.avatar || null);
            } catch {
                setAvatarUrl(null);
            }
        }
        fetchRating();
        fetchAvatar();
    }, []);

    const handlePhotoClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const res = await fetch("http://localhost:3333/me/avatar", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setAvatarUrl(data.avatar);
        } catch {
            alert("Erro ao atualizar foto de perfil.");
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Foto do Perfil
                    </h3>
                </CardHeader>
                <CardContent className="text-center">
                    <div
                        className={`w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center relative cursor-pointer ${
                            isEditing ? "hover:ring-2 hover:ring-blue-400" : ""
                        }`}
                        onClick={handlePhotoClick}
                        style={{ overflow: "hidden" }}
                        title={isEditing ? "Clique para alterar foto" : undefined}
					>
                        {avatarUrl ? (
                            <img
                                src={`http://localhost:3333${avatarUrl}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-16 h-16 text-gray-400" />
                        )}
                        {isEditing && (
                            <span className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
                                <Camera className="w-5 h-5 text-blue-600" />
                            </span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>
                    {isEditing && (
                        <ActionButton onClick={handlePhotoClick}>Alterar Foto</ActionButton>
                    )}
                </CardContent>
            </Card>

            {/* Rating Summary */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Avaliações</h3>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="text-3xl font-bold text-gray-900">
                        {rating > 0 ? rating.toFixed(1) : "--"}
                    </div>
                    <div className="flex justify-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-5 w-5 ${
                                    star <= Math.round(rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {totalReviews > 0
                            ? `Baseado em ${totalReviews} avaliação${
                                    totalReviews > 1 ? "s" : ""
                              }`
                            : "Sem avaliações ainda"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}