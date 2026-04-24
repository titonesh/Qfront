// import React, { useState, useRef, useEffect } from 'react';
// import { Menu, X, ArrowRight, ChevronDown, QrCode, Download, Printer, X as XIcon } from 'lucide-react';
// import QRCode from 'qrcode';
// import { useNavigate } from 'react-router-dom';

// // You'll need to add your logo image to src/assets/images/
// // For now, we'll use a placeholder
// const NCBALogo = '/src/assets/images/logoIcon.png'; // Update this path

// export default function HomePage() {
//     const navigate = useNavigate();
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const [openFaq, setOpenFaq] = useState(null);
//     const [showQRModal, setShowQRModal] = useState(false);
//     const qrCanvasRef = useRef(null);
//     const [qrGenerated, setQrGenerated] = useState(false);

//     const QR_URL = import.meta.env.VITE_QR_URL || 'http://localhost:3001/welcome';

//     const scrollToSection = (e, id) => {
//         e.preventDefault();
//         const element = document.getElementById(id);
//         if (element) {
//             const offset = 80;
//             const bodyRect = document.body.getBoundingClientRect().top;
//             const elementRect = element.getBoundingClientRect().top;
//             const elementPosition = elementRect - bodyRect;
//             const offsetPosition = elementPosition - offset;
//             window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
//         }
//         setMobileMenuOpen(false);
//     };

//     useEffect(() => {
//         if (showQRModal && qrCanvasRef.current && !qrGenerated) {
//             QRCode.toCanvas(
//                 qrCanvasRef.current,
//                 QR_URL,
//                 {
//                     width: 300,
//                     margin: 2,
//                     color: { dark: '#3AB3E5', light: '#FFFFFF' },
//                     errorCorrectionLevel: 'H',
//                 },
//                 (error) => {
//                     if (error) console.error('QR Code generation error:', error);
//                     else setQrGenerated(true);
//                 }
//             );
//         }
//     }, [showQRModal, QR_URL, qrGenerated]);

//     const downloadQRCode = () => {
//         if (qrCanvasRef.current) {
//             const url = qrCanvasRef.current.toDataURL('image/png');
//             const link = document.createElement('a');
//             link.download = 'mortgage-prequalification-qr.png';
//             link.href = url;
//             link.click();
//         }
//     };

//     const printQRCode = () => {
//         if (qrCanvasRef.current) {
//             const image = qrCanvasRef.current.toDataURL('image/png');
//             const printWindow = window.open('', '', 'width=400,height=500');
//             printWindow.document.write(`
//         <html>
//           <head><title>Mortgage Prequalification QR Code</title>
//           <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial}img{max-width:300px;margin:20px}h1{font-size:24px}p{color:#666}</style>
//           </head>
//           <body><h1>Mortgage Prequalification</h1><p>Scan this QR code to get started</p><img src="${image}" /></body>
//         </html>
//       `);
//             printWindow.document.close();
//             printWindow.print();
//         }
//     };

//     const processSteps = [
//         { number: '01', title: 'Register Account', description: 'Provide basic information to get started with your mortgage journey.' },
//         { number: '02', title: 'Complete Financial Profile', description: 'Fill in your income, obligations, and property preferences for accurate assessments.' },
//         { number: '03', title: 'Get Instant Prequalification', description: 'Receive immediate affordability assessment and explore mortgage options that suit your needs.' }
//     ];

//     const faqs = [
//         { question: "What is mortgage prequalification?", answer: "Prequalification is a preliminary assessment of your loan eligibility based on your financial information. It's quick, non-binding, and gives you an estimate of how much you can borrow." },
//         { question: "How does the prequalification process work?", answer: "Simply fill in your financial information including income, existing obligations, and preferred loan tenor. Our system instantly calculates your affordability." },
//         { question: "Is my information secure?", answer: "Yes, we use NCBA-grade bank-level encryption, multi-factor authentication, and comply with all financial industry security standards." }
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//             {/* Header */}
//             <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-ncb-divider shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-16">
//                         <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => scrollToSection(e, 'hero')}>
//                             <img
//                                 src="/src/assets/images/logo.png"
//                                 alt="Mortgage Logo"
//                                 className="h-8 w-auto object-contain"
//                             />
//                             <span className="font-bold text-ncb-heading"></span>
//                         </div>

//                         {/* Desktop Navigation */}
//                         <div className="hidden lg:flex items-center gap-8">
//                             <button onClick={(e) => scrollToSection(e, 'hero')} className="text-ncb-text hover:text-ncb-blue transition-colors">Home</button>
//                             <button onClick={(e) => scrollToSection(e, 'about')} className="text-ncb-text hover:text-ncb-blue transition-colors">How It Works</button>
//                             <button onClick={(e) => scrollToSection(e, 'faqs')} className="text-ncb-text hover:text-ncb-blue transition-colors">FAQs</button>
//                             <button onClick={() => navigate('/products')} className="px-6 py-2 bg-ncb-blue text-white rounded-lg hover:bg-ncb-blue-dark transition-all shadow-md">
//                                 Get Started
//                             </button>
//                         </div>

//                         {/* Mobile menu button */}
//                         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
//                             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Mobile menu */}
//                 {mobileMenuOpen && (
//                     <div className="lg:hidden bg-white border-t border-ncb-divider py-4">
//                         <div className="flex flex-col gap-3 px-4">
//                             <button onClick={(e) => scrollToSection(e, 'hero')} className="py-2 text-ncb-text">Home</button>
//                             <button onClick={(e) => scrollToSection(e, 'about')} className="py-2 text-ncb-text">How It Works</button>
//                             <button onClick={(e) => scrollToSection(e, 'faqs')} className="py-2 text-ncb-text">FAQs</button>
//                             <button onClick={() => navigate('/welcome')} className="py-3 bg-ncb-blue text-white rounded-lg">Get Started</button>
//                         </div>
//                     </div>
//                 )}
//             </header>

//             {/* Hero Section */}
//             <section id="hero" className="pt-12 pb-20 px-4">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="bg-gradient-to-br from-white to-ncb-blue-50 rounded-3xl p-8 lg:p-16 shadow-lg">
//                         <div className="grid lg:grid-cols-2 gap-12 items-center">
//                             <div className="space-y-6">
//                                 <div className="inline-block px-4 py-1.5 bg-ncb-blue-100 rounded-full">
//                                     <span className="text-xs font-bold text-ncb-blue uppercase">Mortgage Prequalification</span>
//                                 </div>
//                                 <h1 className="text-4xl lg:text-6xl font-bold text-ncb-heading">
//                                     Seamless <span className="text-ncb-blue">Mortgage</span> Solutions
//                                 </h1>
//                                 <p className="text-lg text-ncb-text">Want to find a home? We are ready to help you find one that suits your lifestyle and needs.</p>

//                                 {/* QR Code Button */}
//                                 <button onClick={() => setShowQRModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-ncb-blue text-ncb-blue rounded-lg hover:bg-ncb-blue-50 transition-all">
//                                     <QrCode size={20} /> Scan QR Code
//                                 </button>
//                             </div>
//                             <div className="relative">
//                                 <div className="bg-gradient-to-br from-ncb-blue to-ncb-blue-dark rounded-2xl p-8 text-center text-white">
//                                     <QrCode size={80} className="mx-auto mb-4" />
//                                     <p className="text-sm">Scan to start your mortgage journey</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* How It Works Section */}
//             <section id="about" className="py-16 px-4">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="text-center mb-12">
//                         <h2 className="text-4xl font-bold text-ncb-heading">How It Works</h2>
//                         <p className="text-ncb-text mt-4 max-w-2xl mx-auto">Move through the mortgage journey in a clear order, with each step focused on one action at a time.</p>
//                     </div>
//                     <div className="grid md:grid-cols-3 gap-8">
//                         {processSteps.map((step, index) => (
//                             <div key={step.number} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all text-center group">
//                                 <div className="w-16 h-16 bg-ncb-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-ncb-blue transition-all">
//                                     <span className="text-2xl font-bold text-ncb-blue group-hover:text-white">{index + 1}</span>
//                                 </div>
//                                 <h3 className="text-xl font-bold text-ncb-heading mb-3">{step.title}</h3>
//                                 <p className="text-ncb-text">{step.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* FAQ Section */}
//             <section id="faqs" className="py-16 px-4 bg-ncb-blue-50">
//                 <div className="max-w-4xl mx-auto">
//                     <div className="text-center mb-12">
//                         <h2 className="text-4xl font-bold text-ncb-heading">Frequently Asked Questions</h2>
//                     </div>
//                     <div className="space-y-4">
//                         {faqs.map((faq, index) => (
//                             <div key={index} className="bg-white rounded-xl border border-ncb-divider overflow-hidden">
//                                 <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center p-6 text-left">
//                                     <span className="font-semibold text-ncb-heading">{faq.question}</span>
//                                     <ChevronDown className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} size={20} />
//                                 </button>
//                                 {openFaq === index && (
//                                     <div className="px-6 pb-6">
//                                         <p className="text-ncb-text">{faq.answer}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             {/* Footer */}
//             <footer className="bg-white border-t border-ncb-divider py-8 px-4">
//                 <div className="max-w-7xl mx-auto text-center">
//                     <p className="text-sm text-ncb-text">© 2026 NCBA Mortgage. All rights reserved.</p>
//                 </div>
//             </footer>

//             {/* QR Modal */}
//             {showQRModal && (
//                 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//                     <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
//                         <div className="bg-ncb-blue px-6 py-4 flex justify-between items-center">
//                             <h3 className="text-white font-bold">QR Code</h3>
//                             <button onClick={() => setShowQRModal(false)} className="text-white"><XIcon size={24} /></button>
//                         </div>
//                         <div className="p-8 text-center">
//                             <canvas ref={qrCanvasRef} className="mx-auto border rounded-lg p-4" />
//                             <p className="text-sm text-ncb-text mt-4 break-all">{QR_URL}</p>
//                             <div className="mt-6 space-y-3">
//                                 <button onClick={downloadQRCode} disabled={!qrGenerated} className="w-full py-3 bg-ncb-blue text-white rounded-lg hover:bg-ncb-blue-dark disabled:opacity-50">Download QR Code</button>
//                                 <button onClick={printQRCode} disabled={!qrGenerated} className="w-full py-3 border border-ncb-blue text-ncb-blue rounded-lg hover:bg-ncb-blue-50 disabled:opacity-50">Print QR Code</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }






import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowRight, ChevronDown, QrCode, Download, Printer, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';

// Import house images
import House1 from '../assets/images/house1.jpg';
import House2 from '../assets/images/house2.jpg';
import House3 from '../assets/images/house3.webp';
import House4 from '../assets/images/house6.jpg';
import NCBALogo from '../assets/images/logo.png';

export default function HomePage() {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const qrCanvasRef = useRef(null);
    const [qrGenerated, setQrGenerated] = useState(false);

    const QR_URL = import.meta.env.VITE_QR_URL || 'http://localhost:3001/products';

    // Carousel images array
    const carouselImages = [
        { src: House1, alt: 'Modern Luxury House', title: 'Modern Luxury Home', price: 'KES 12.5M' },
        { src: House2, alt: 'Family Villa', title: 'Family Villa', price: 'KES 8.2M' },
        { src: House3, alt: 'Beachfront Property', title: 'Beachfront Property', price: 'KES 25M' },
        { src: House4, alt: 'Suburban Home', title: 'Suburban Home', price: 'KES 6.8M' },
    ];

    // Auto-advance carousel every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [carouselImages.length]);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
    };

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    useEffect(() => {
        if (showQRModal && qrCanvasRef.current && !qrGenerated) {
            QRCode.toCanvas(
                qrCanvasRef.current,
                QR_URL,
                {
                    width: 300,
                    margin: 2,
                    color: { dark: '#3AB3E5', light: '#FFFFFF' },
                    errorCorrectionLevel: 'H',
                },
                (error) => {
                    if (error) console.error('QR Code generation error:', error);
                    else setQrGenerated(true);
                }
            );
        }
    }, [showQRModal, QR_URL, qrGenerated]);

    const downloadQRCode = () => {
        if (qrCanvasRef.current) {
            const url = qrCanvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'mortgage-prequalification-qr.png';
            link.href = url;
            link.click();
        }
    };

    const printQRCode = () => {
        if (qrCanvasRef.current) {
            const image = qrCanvasRef.current.toDataURL('image/png');
            const printWindow = window.open('', '', 'width=400,height=500');
            printWindow.document.write(`
                <html>
                    <head><title>Mortgage Prequalification QR Code</title>
                    <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Arial}img{max-width:300px;margin:20px}h1{font-size:24px}p{color:#666}</style>
                    </head>
                    <body><h1>Mortgage Prequalification</h1><p>Scan this QR code to get started</p><img src="${image}" /></body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const processSteps = [
        { number: '01', title: 'Basic Info', description: 'Provide basic information to get started with your mortgage journey.' },
        { number: '02', title: 'Complete Financial Profile', description: 'Fill in your income, obligations, and property preferences for accurate assessments.' },
        { number: '03', title: 'Get Instant Prequalification', description: 'Receive immediate affordability assessment and explore mortgage options that suit your needs.' }
    ];

    const faqs = [
        { question: "What is mortgage prequalification?", answer: "Prequalification is a preliminary assessment of your loan eligibility based on your financial information. It's quick, non-binding, and gives you an estimate of how much you can borrow." },
        { question: "How does the prequalification process work?", answer: "Simply fill in your financial information including income, existing obligations, and preferred loan tenor. Our system instantly calculates your affordability." },
        { question: "Is my information secure?", answer: "Yes, we use NCBA-grade bank-level encryption, multi-factor authentication, and comply with all financial industry security standards." }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-ncb-divider shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => scrollToSection(e, 'hero')}>
                            <img
                                src={NCBALogo}
                                alt="NCBA Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <span className="font-bold text-ncb-heading"></span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            <button onClick={(e) => scrollToSection(e, 'hero')} className="text-ncb-text hover:text-ncb-blue transition-colors">Home</button>
                            <button onClick={(e) => scrollToSection(e, 'about')} className="text-ncb-text hover:text-ncb-blue transition-colors">How It Works</button>
                            <button onClick={(e) => scrollToSection(e, 'faqs')} className="text-ncb-text hover:text-ncb-blue transition-colors">FAQs</button>
                            <button onClick={() => navigate('/welcome')} className="px-6 py-2 bg-ncb-blue text-white rounded-lg hover:bg-ncb-blue-dark transition-all shadow-md">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-ncb-divider py-4">
                        <div className="flex flex-col gap-3 px-4">
                            <button onClick={(e) => scrollToSection(e, 'hero')} className="py-2 text-ncb-text">Home</button>
                            <button onClick={(e) => scrollToSection(e, 'about')} className="py-2 text-ncb-text">How It Works</button>
                            <button onClick={(e) => scrollToSection(e, 'faqs')} className="py-2 text-ncb-text">FAQs</button>
                            <button onClick={() => navigate('/welcome')} className="py-3 bg-ncb-blue text-white rounded-lg">Get Started</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section with Carousel */}
            <section id="hero" className="pt-12 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-white to-ncb-blue-50 rounded-3xl p-8 lg:p-16 shadow-lg">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Side - Text Content */}
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1.5 bg-ncb-blue-100 rounded-full">
                                    <span className="text-xs font-bold text-ncb-blue uppercase">Mortgage Prequalification</span>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-bold text-ncb-heading">
                                    Seamless <span className="text-ncb-blue">Mortgage</span> Solutions
                                </h1>
                                <p className="text-lg text-ncb-text">Want to find a home? We are ready to help you find one that suits your lifestyle and needs.</p>

                                {/* QR Code Button */}
                                <button onClick={() => setShowQRModal(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-ncb-blue text-ncb-blue rounded-lg hover:bg-ncb-blue-50 transition-all">
                                    <QrCode size={20} /> Scan QR Code
                                </button>
                            </div>

                            {/* Right Side - Image Carousel */}
                            <div className="relative group">
                                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-ncb-blue to-ncb-blue-dark">
                                    {/* Main Image */}
                                    <div className="relative h-80 lg:h-96">
                                        <img
                                            src={carouselImages[currentImageIndex].src}
                                            alt={carouselImages[currentImageIndex].alt}
                                            className="w-full h-full object-cover transition-opacity duration-500"
                                        />
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        
                                        {/* Image Info Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-xl font-bold mb-1">{carouselImages[currentImageIndex].title}</h3>
                                            <p className="text-lg font-semibold text-ncb-blue-100">{carouselImages[currentImageIndex].price}</p>
                                        </div>
                                    </div>

                                    {/* Navigation Arrows */}
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <ChevronLeft size={24} className="text-ncb-blue" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    >
                                        <ChevronRight size={24} className="text-ncb-blue" />
                                    </button>

                                    {/* Dots Indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {carouselImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    currentImageIndex === index
                                                        ? 'bg-white w-6'
                                                        : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="about" className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-ncb-heading">How It Works</h2>
                        <p className="text-ncb-text mt-4 max-w-2xl mx-auto">Move through the mortgage journey in a clear order, with each step focused on one action at a time.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={step.number} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all text-center group">
                                <div className="w-16 h-16 bg-ncb-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-ncb-blue transition-all">
                                    <span className="text-2xl font-bold text-ncb-blue group-hover:text-white">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-bold text-ncb-heading mb-3">{step.title}</h3>
                                <p className="text-ncb-text">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faqs" className="py-16 px-4 bg-ncb-blue-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-ncb-heading">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl border border-ncb-divider overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center p-6 text-left">
                                    <span className="font-semibold text-ncb-heading">{faq.question}</span>
                                    <ChevronDown className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`} size={20} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6">
                                        <p className="text-ncb-text">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-ncb-divider py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <img
                            src={NCBALogo}
                            alt="NCBA Logo"
                            className="h-6 w-auto object-contain"
                        />
                        <span className="font-semibold text-ncb-heading">NCBA Mortgage</span>
                    </div>
                    <p className="text-sm text-ncb-text">© 2026 NCBA Mortgage. All rights reserved.</p>
                </div>
            </footer>

            {/* QR Modal */}
            {showQRModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-ncb-blue px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white font-bold">QR Code</h3>
                            <button onClick={() => setShowQRModal(false)} className="text-white"><XIcon size={24} /></button>
                        </div>
                        <div className="p-8 text-center">
                            <canvas ref={qrCanvasRef} className="mx-auto border rounded-lg p-4" />
                            <p className="text-sm text-ncb-text mt-4 break-all">{QR_URL}</p>
                            <div className="mt-6 space-y-3">
                                <button onClick={downloadQRCode} disabled={!qrGenerated} className="w-full py-3 bg-ncb-blue text-white rounded-lg hover:bg-ncb-blue-dark disabled:opacity-50">Download QR Code</button>
                                <button onClick={printQRCode} disabled={!qrGenerated} className="w-full py-3 border border-ncb-blue text-ncb-blue rounded-lg hover:bg-ncb-blue-50 disabled:opacity-50">Print QR Code</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}