import React from 'react';
import { useStore } from '../context/StoreContext';
import { Instagram, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import Button from './ui/Button';

const Header: React.FC = () => {
    const { settings, isStoreOpen } = useStore();

    return (
        <header className="flex flex-col md:flex-row items-center gap-6 mb-8 p-4 border-b border-gray-800">
            {/* Logo with Gradient Ring */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full flex-shrink-0 p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <div className="bg-gray-900 rounded-full w-full h-full p-0.5 overflow-hidden">
                    <img
                        src={settings.profilePhotoUrl || "https://raw.githubusercontent.com/saboracaiteria/SABOR-/main/175.jpg"}
                        alt="Sabor Açaíteria"
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-100">
                    Sabor Açaíteria
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-2 mt-2 text-sm text-gray-400 justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <span className="font-medium">{isStoreOpen ? 'Aberto Agora' : 'Fechado'}</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>Canaã dos Carajás</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-4 flex justify-center md:justify-start gap-6 text-center">
                    <div>
                        <p className="font-bold text-gray-100">38</p>
                        <p className="text-xs text-gray-400">posts</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-100">1.6k</p>
                        <p className="text-xs text-gray-400">seguidores</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-100">3.5k</p>
                        <p className="text-xs text-gray-400">seguindo</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 justify-center md:justify-start relative">
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-green-400 animate-bounce hidden md:block">
                        <ArrowRight size={24} />
                    </div>

                    <a
                        href="https://www.instagram.com/sabor_acaiteria/profilecard/?igsh=NjF2ZWMwNHNiNzI0"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-none"
                    >
                        <Button className="w-full md:w-auto text-sm py-2 px-4 h-10">
                            <Instagram size={16} /> Seguir
                        </Button>
                    </a>

                    <a
                        href={`https://wa.me/${settings.whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-none"
                    >
                        <Button className="w-full md:w-auto text-sm py-2 px-4 h-10">
                            <MessageCircle size={16} /> Mensagem
                        </Button>
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;