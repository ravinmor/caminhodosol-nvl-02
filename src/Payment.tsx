import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import './payment.css'; // Importando o CSS que criaremos abaixo

const PixPayment: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // A string exata que você forneceu
  const pixCode = "00020126580014br.gov.bcb.pix01360c76fd51-a3c1-4478-a47a-d6044072421e5204000053039865406299.995802BR5913Daniel Macedo6009Sao Paulo62230519daqr48877848993223463047EB9";

  // Link de pagamento alternativo (exemplo)
  const paymentLink = "https://seusite.com/checkout"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    
    // Reseta a mensagem de "Copiado" após 2 segundos
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        
        <h2>Pagamento via Pix</h2>
        <p className="description">Escaneie o QR Code ou clique no código para copiar.</p>

        {/* Área do QR Code (Fundo branco necessário para leitura) */}
        <div className="qr-wrapper">
          <QRCode 
            value={pixCode} 
            size={200} 
            fgColor="#000000" 
            bgColor="#FFFFFF" 
          />
        </div>

        {/* Área do Pix Copia e Cola */}
        <div className="pix-copy-area" onClick={handleCopy} title="Clique para copiar">
          <span className="pix-label">Pix Copia e Cola:</span>
          <code className="pix-code">
            {pixCode}
          </code>
          <span className={`copy-feedback ${copied ? 'visible' : ''}`}>
            {copied ? '✅ Código Copiado!' : 'Clique para copiar'}
          </span>
        </div>

        <div className="divider"></div>
      </div>
    </div>
  );
};

export default PixPayment;