import React from 'react';
import { AlertTriangle, User } from 'lucide-react';

export type UnauthorizedAccessProps = {
  area?: string;
  userPicture?: string;
  userName?: string;
};

const UnauthorizedAccess = ({ 
  area = "esta área", 
  userPicture,
  userName 
}: UnauthorizedAccessProps) => {
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <div className="absolute inset-0 rounded-3xlZ opacity-20 blur-xl animate-pulse"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-2xl">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-red-600 to-red-600 animate-spin-slow opacity-100"></div>
            
            <div className="absolute inset-2 rounded-full bg-white overflow-hidden border-2 border-gray-100">
              {userPicture ? (
                <img 
                  src={userPicture} 
                  alt={userName || "User"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User 
                    size={40} 
                    className="text-gray-500"
                  />
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle 
                size={20} 
                className="text-white drop-shadow-sm" 
                strokeWidth={2.5}
              />
            </div>
            
            {/* Efeitos de luz adicionais */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 animate-ping"></div>
          </div>
          
          {/* User Name (if provided) */}
          {userName && (
            <p className="text-sm text-zinc-600 text-center mb-2">
              Olá, <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-medium">{userName}</span>
            </p>
          )}
          
          {/* Título */}
          <h1 className="text-2xl font-bold text-center mb-4 text-black">
            Acesso Negado
          </h1>
          
          {/* Mensagem */}
          <p className="text-zinc-700 text-center leading-relaxed mb-6">
            Você não possui autorização para acessar{' '}
            <span className="font-semibold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {area}
            </span>
            .
          </p>
          
          {/* Linha decorativa */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-4"></div>
          
          {/* Texto adicional */}
          <p className="text-sm text-zinc-600 text-center">
            Entre em contato com o administrador do sistema para obter as permissões necessárias.
          </p>
        </div>
        
        {/* Partículas decorativas */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500/30 rounded-full blur-sm animate-bounce"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-red-500/30 rounded-full blur-sm animate-bounce delay-300"></div>
        <div className="absolute top-1/2 -right-8 w-4 h-4 bg-pink-500/30 rounded-full blur-sm animate-bounce delay-700"></div>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default UnauthorizedAccess;