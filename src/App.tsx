import { Parallax, ParallaxLayer } from '@react-spring/parallax';
import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import './App.css';

// --- IMPORTAÇÃO DAS IMAGENS (Necessário para funcionar na Vercel) ---
import logoImg from './assets/images/caminho_do_sol-no_bg.png';
import layer20_2 from './assets/images/layer-20-2.png';
import layer21 from './assets/images/layer-21.png';
import layer22 from './assets/images/layer-22.png';
import layer23 from './assets/images/layer-23.png';
import layerHook1 from './assets/images/layer-hook-1.png';
import layerHook2 from './assets/images/layer-hook-2.png';
import daniImg from './assets/images/dani.jpg';
import ravinImg from './assets/images/ravin.jpg';


const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect(); // Anima apenas uma vez
        }
      },
      { threshold: 0.15 } // Dispara quando 15% do item aparece
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-item ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </div>
  );
};

function App() {
  const parallax = useRef<any>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [pageCount, setPageCount] = useState(() => 
    window.innerWidth < 540 ? 13 : 
    (window.innerWidth < 768 ? 11.3 : 
    (window.innerWidth < 1240 ? 10 : 8.4))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2.5 segundos de loading

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
        const width = window.innerWidth;
        if (width < 540) setPageCount(13);
        else if (width < 768) setPageCount(11.3);
        else if (width < 1240) setPageCount(10);
        else setPageCount(8.4);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const target = new Date("2026-02-05T23:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference < 0) return clearInterval(interval);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (offset: number) => {
    parallax.current?.scrollTo(offset);
    setMenuOpen(false);
  };

  const handleScrollToId = (id: string) => {
    const element = document.getElementById(id);
    // IMPORTANTE: Esse valor deve ser IGUAL ao offset da sua Layer de conteúdo (Info/Cronograma)
    const LAYER_START = 2.99; 

    if (element && parallax.current) {
      // 1. Encontra o container pai (a div parallax-content-wrapper)
      const container = element.closest('.parallax-content-wrapper');

      if (container) {
        // 2. Calcula a distância do elemento até o topo desse container
        // Isso nos dá a posição fixa dele dentro da seção, independente do scroll
        const relativeTop = element.getBoundingClientRect().top - container.getBoundingClientRect().top;

        // 3. Converte pixels para "unidades de página" do Parallax
        const pageOffset = relativeTop / window.innerHeight;

        // 4. Soma o início da layer + a posição relativa
        // O -0.05 é um pequeno ajuste para dar um respiro no topo
        parallax.current.scrollTo(LAYER_START + pageOffset - 0.05);
        
        setMenuOpen(false);
      }
    }
  };

  return (
    <div className="app-container">
      <div className={`preloader-container ${!loading ? 'preloader-hidden' : ''}`}>
        <img 
          src={logoImg} 
          alt="Carregando..." 
          className="pulsing-icon"
        />
      </div>
      <header className={`main-header ${menuOpen ? 'menu-active' : ''}`} style={{ position: 'fixed', zIndex: 1000, width: '100%' }}>
        <div className="logo">
          <img src={logoImg} alt="Logo" style={{ width: '50px' }} />
        </div>

        {/* Ícone do Menu (Visível apenas no mobile via CSS) */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navegação (Classes dinâmicas para abrir/fechar) */}
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
          {/* Botões agora apontam para IDs específicos */}
          <button onClick={() => handleScrollToId('roadmap')} className="nav-link-btn">Cronograma</button>
          <button onClick={() => handleScrollToId('payment')} className="nav-link-btn">Inscreva-se</button>
          <button onClick={() => handleScrollToId('guides')} className="nav-link-btn">Sobre Nós</button>
          <button onClick={() => handleScrollToId('faq')} className="nav-link-btn">FAQ</button>
        </nav>

        {/* Botão Flutuante Fixo (Opção do Header) */}
        <a 
          href="SEU_LINK_CHECKOUT" 
          target="_blank"
          className="floating-cta"
        >
          Garantir Minha Vaga
        </a>
      </header>

      <Parallax ref={parallax} pages={pageCount}>
        {/* HERO SECTION OFFSET 0 */}
        <ParallaxLayer 
          offset={0} 
          speed={0.2} 
          style={{
              backgroundImage: `url(${layer20_2})`, 
              backgroundSize: 'cover', backgroundPosition: 'center' 
          }} 
        />

        <ParallaxLayer offset={0} speed={0.1} style={{ pointerEvents: 'none', zIndex: 1 }}>
          <div className="clouds-layer">
            
            <div className="cloud-container cloud--one">
              <div className="cloud"></div>
            </div>
            
            <div className="cloud-container cloud--two">
              <div className="cloud"></div>
            </div>
            
            <div className="cloud-container cloud--three">
              <div className="cloud"></div>
            </div>

          </div>
        </ParallaxLayer>

        <ParallaxLayer 
          offset={0} 
          speed={0.3} 
          style={{ 
            pointerEvents: 'none', 
            zIndex: 2
          }}
        >
          <div className="bird-flock">
              
            <div className="bird-container bird-container--one">
              <div className="bird bird--one"></div>
            </div>
            
            <div className="bird-container bird-container--two">
              <div className="bird bird--two"></div>
            </div>
            
            <div className="bird-container bird-container--three">
              <div className="bird bird--three"></div>
            </div>

          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 5 }}>
          <div className="light-rays"></div>
          <div style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 11, top: '-16px' }}>
            <h1 className="hero-title">A AVENTURA COMEÇA</h1>
            <h3 className="hero-subtitle">O próximo desafio está aqui</h3>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={0} speed={0.6} factor={1} style={{ backgroundImage: `url(${layer21})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 10  }} />
        <ParallaxLayer offset={0} speed={0.8} factor={1} style={{ backgroundImage: `url(${layer22})`, backgroundSize: 'cover', backgroundPosition: 'bottom center', zIndex: 10  }} />
        <ParallaxLayer offset={0} speed={1} factor={1} style={{ backgroundImage: `url(${layer23})`, backgroundSize: 'cover', backgroundPosition: 'bottom center', zIndex: 10 }} />
        <ParallaxLayer offset={0} speed={1} factor={1} style={{ background: 'linear-gradient(to bottom, transparent 60%, #0D0818 98%, #0D0818 100%)', zIndex: 14 }} />
        
        {/* SEÇÃO TÍTULO E HISTÓRIA (SCROLL TELLING) OFFSET 0.99 */}
        <ParallaxLayer 
          offset={0.99} 
          speed={1} 
          factor={4} 
          style={{ background: 'linear-gradient(to bottom, #0D0818 0%, #1a1025 20%, #102C51 100%)', zIndex: 16 }} 
        >
          <div className="parallax-content-wrapper" style={{ padding: '10% 5% 0 5%', display: 'flex', alignItems: 'start', justifyContent: 'center' }}>
            <section className="hook-section" style={{ background: 'none', width: '100%' }}>
              <div className="hook-content" style={{ textAlign: 'center' }}>
                
                <Reveal>
                  <div className="chapter-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                    <span className="line-accent"></span>
                    <span style={{ margin: '0 15px' }}>Nível 02</span>
                    <span className="line-accent"></span>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <h1 className="chapter-title">
                    Vértice<br/>
                    <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>&</span> Logos
                  </h1>
                </Reveal>
                
                <Reveal delay={400}>
                  <p className="chapter-subtitle">
                    Quando o sofrimento da subida <br/> revela o sentido da existência.
                  </p>
                </Reveal>

              </div>
            </section>
          </div>

          <div className="parallax-content-wrapper">
            <div className="story-container">

              {/* BLOCO 1: O Sofrimento Inevitável */}
              <div className="story-block">
                <div className="story-content">
                  <div className="story-text">
                    <Reveal>
                      <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>O Sofrimento Inevitável</h2>
                      <p>
                        A subida da Pedra da Macela exige mais que pernas fortes. Como Frankl ensina, o sofrimento é parte inerente da vida. Aqui, na escuridão da madrugada, encaramos o desconforto físico não como um inimigo, mas como o cenário onde nossa resiliência é forjada.
                      </p>
                    </Reveal>
                  </div>
                  <div className="story-image">
                    <Reveal delay={200}>
                      <img src={layerHook1} alt="Subida íngreme e esforço" />
                    </Reveal>
                  </div>
                </div>
              </div>

              {/* BLOCO 2: A Liberdade Última (Reverse) */}
              <div className="story-block">
                <div className="story-content reverse">
                  <div className="story-text">
                    <Reveal>
                      <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>A Liberdade Última</h2>
                      <p>
                        Debateremos a Logoterapia. Aprendemos que, mesmo exaustos pelo frio e pelo cansaço, possuímos a última das liberdades humanas: a capacidade de escolher nossa atitude diante de qualquer circunstância. O ambiente não define você; sua escolha define.
                      </p>
                    </Reveal>
                  </div>
                  <div className="story-image">
                    <Reveal delay={200}>
                      <img src={layerHook2} alt="Estudo no topo" />
                    </Reveal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* INFORMAÇÕES GERAIS  */}
        <ParallaxLayer offset={2.99} speed={1} factor={6}>
          <div className="parallax-content-wrapper">
            
            {/* TIMER MINIMALISTA */}
            <section className="event-date-section">
              <Reveal>
                <h4 style={{ color: '#F5F5F5', fontSize: '1.2rem', fontWeight: '600', marginBottom: '5rem', letterSpacing: '0.5px' }}>
                  A aventura será 05 de Fevereiro de 2026
                </h4>
                <div className="countdown-timer minimal">
                  <div className="timer-item"><span className="timer-number">{timeLeft.days}</span><span className="timer-label">Dias</span></div>
                  <div className="timer-item"><span className="timer-number">{timeLeft.hours}</span><span className="timer-label">Horas</span></div>
                  <div className="timer-item"><span className="timer-number">{timeLeft.minutes}</span><span className="timer-label">Min</span></div>
                  <div className="timer-item"><span className="timer-number">{timeLeft.seconds}</span><span className="timer-label">Segs</span></div>
                </div>
              </Reveal>
            </section>
            
            {/* CRONOGRAMA */}
            <section id="roadmap" className="roadmap-field">
              <h2 className="subtitle">Cronograma</h2>
              <div className="nine-columns-container">
                {[
                  { title: "23h00", text: "Início do Desafio na Barra Funda" },
                  { title: "01h00", text: "Pausa para o fôlego e café rápido" },
                  { title: "04h00", text: "O pé na montanha na madrugada" },
                  { title: "05h30", text: "O sol tocando o rosto a 1.840m" },
                  { title: "08h00", text: "Lavando a alma nas cachoeiras" },
                  { title: "12h00", text: "Deslocamento para almoço(Não incluso)" },
                  { title: "18h00", text: "Por do sol no Lavandário" },
                  { title: "18h30", text: "Viagem de volta" },
                  { title: "23h00", text: "A volta para a estação barra funda" }
                ].map((item, i) => (
                  <div key={i} className="column-item">
                    <div className="column-overlay"></div>
                    <div className="column-content">
                      <h2 className="column-title">{item.title}</h2>
                      <p className="column-description">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* O QUE LEVAR */}
            <section className="what-to-bring-section">
              <h2 className="section-title">O Que Levar</h2>
              <p className="section-subtitle" style={{ textAlign: 'center', color: '#B0B0B0', marginBottom: '3rem', marginTop: '-2rem' }}>Prepare-se para a jornada. O essencial é obrigatório.</p>
              <div className="bring-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {[
                  { icon: "🎒", title: "Mochila Pequena", desc: "Apenas o suficiente para seus itens, mantendo as mãos livres." },
                  { icon: "💧", title: "Água (Mín. 1,5L)", desc: "Hidratação é fundamental para a subida na Macela." },
                  { icon: "🥪", title: "Lanche Leve", desc: "Frutas, sanduíches ou barras de cereal para o cume." },
                  { icon: "🧢", title: "Protetor Solar", desc: "A exposição ao sol na montanha é alta, mesmo no frio." },
                  { icon: "🌧️", title: "Capa de Chuva", desc: "O tempo em Cunha muda rápido. Esteja prevenido." },
                  { icon: "🔦", title: "Lanterna", desc: "Obrigatório para a subida noturna. De preferência de cabeça." },
                  { icon: "🧥", title: "Agasalho Pesado", desc: "No cume da Macela, a temperatura cai drasticamente antes do sol nascer." },
                  { icon: "🗑️", title: "Saco para Lixo", desc: "Traga todo o seu lixo de volta. Deixe apenas pegadas." },
                  { icon: "👟", title: "Tênis de Trilha", desc: "Ou bota de caminhada com boa aderência (solado antiderrapante)." },
                  { icon: "👕", title: "Troca de Roupa", desc: "Para garantir seu conforto na viagem de volta." },
                  { icon: "🩳", title: "Roupa de Banho", desc: "Para aproveitar as cachoeiras do roteiro." },
                  { icon: "🧖", title: "Toalha", desc: "Essencial para se secar após o banho de cachoeira." }
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 30}>
                    <div className="bring-item" style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)', padding: '2rem', borderRadius: '12px', textAlign: 'center', borderTop: '3px solid #102C51', backdropFilter: 'blur(10px)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                      <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'white' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#B0B0B0', lineHeight: '1.6' }}>{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/*PAGAMENTO */}
            <section id="payment" className="investment-section" style={{ background: 'none' }}>
              <h2 className="section-title">Valor do Investimento</h2>
              
              <Reveal>
                <div className="investment-box">
                  
                  {/* Preço */}
                  <div className="price-header">
                    <span className="lot-badge">🔥 1º Lote</span>
                    <span className="old-price">de R$ 499,00</span>
                    <span className="investment-price">por R$ 299,00</span>
                  </div>
                  
                  <p style={{ color: '#ccc', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Garanta seu lugar nesta experiência única.<br/>
                    O pagamento é seguro e a confirmação é imediata.
                  </p>
                  
                  <a 
                    href="LINK_DO_SEU_CHECKOUT" 
                    target="_blank" 
                    className="cta-button payment-btn"
                  >
                    Garantir Minha Vaga
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '400', marginTop: '5px', opacity: 0.9 }}>
                      (Cartão de Crédito ou PIX)
                    </span>
                  </a>

                  <span className="divider-text">Precisa de ajuda ou prefere pagar manualmente?</span>

                  {/* Botão Secundário - WhatsApp */}
                  <a 
                    href="https://wa.me/5584998385541?text=Ol%C3%A1!%20Estou%20com%20d%C3%BAvidas%20sobre%20o%20pagamento%20da%20inscri%C3%A7%C3%A3o%20do%20Banquete%20no%20Topo." 
                    target="_blank" 
                    className="whatsapp-btn"
                  >
                    <span style={{ fontSize: '1.2rem' }}>💬</span> Falar no WhatsApp
                  </a>
                  
                  <small className="disclaimer">
                    * O valor refere-se à experiência, guiamento e instrução. O transporte público (ônibus) até o ponto de encontro não está incluso.
                  </small>

                </div>
              </Reveal>
            </section>

            {/* GUIAS */}
            <section className="guide-section" id="guides" style={{ background: 'none' }}>
              <h2 className="section-title">Seus Mentores</h2>
              <div className="guide-content">
                <div className="guide-image"><img src={daniImg} alt="Daniel" style={{ borderRadius: '50%', border: '4px solid #102C51', width: '100%', maxWidth: '350px' }} /></div>
                <div className="guide-bio">
                  <span className="guide-subtitle">Mentor na Jornada</span>
                  <h3>Daniel Macedo</h3>
                  <p>Mestrando em Filosofia pela PUC-SP e bodybuilder há mais de 2000 anos, Macedo une suas duas paixões: o rigor do pensamento e o desafio físico.</p>
                  <p>Ele acredita que a filosofia não deve ficar trancada em salas de aula, mas sim vivenciada onde o sublime se apresenta.</p>
                  <p className="guide-quote">"Subir a montanha é a 'Escada de Eros' na prática. Primeiro, superamos o obstáculo físico. No topo, usamos essa energia para ascender ao belo."</p>
                </div>
              </div>
              <br/><br/>
              <div className="guide-content guide-reverse">
                <div className="guide-image"><img src={ravinImg} alt="Ravin" style={{ borderRadius: '50%', border: '4px solid #102C51', width: '100%', maxWidth: '350px' }} /></div>
                <div className="guide-bio">
                  <span className="guide-subtitle">Seu Guia na Aventura</span>
                  <h3>Ravin Mor</h3>
                  <p>Sua paixão é empurrar os limites do corpo e da mente nas trilhas mais desafiadoras de São Paulo, onde o termo "quase morrer" é um elogio.</p>
                  <p>Certificado em técnicas de sobrevivência primitiva, ele garante que cada passo na montanha seja seguro, eficiente e cheio de aprendizados práticos.</p>
                  <p>Fora das matas, ele aplica a estratégia de seus 7 anos de experiência como desenvolvedor Full Stack.</p>
                  <p className="guide-quote">"Farei você sofrer."</p>
                </div>
              </div>
            </section>

            {/* LOGÍSTICA */}
            <section className="logistics-section" id="detalhes">
              <h2 className="section-title">Preparado para a Jornada?</h2>
              <div className="logistics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
                <Reveal>
                  <div className="logistics-card" style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)', padding: '2.5rem', borderRadius: '12px', borderTop: '3px solid #102C51', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ color: '#102C51', fontSize: '1.3rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Nível de Dificuldade</h4>
                    <p style={{ color: '#B0B0B0', lineHeight: '1.7' }}><strong>Moderada</strong>. A subida da Pedra da Macela é feita por uma estrada pavimentada, porém com inclinação constante e acentuada.</p>
                  </div>
                </Reveal>
                <Reveal delay={200}>
                  <div className="logistics-card" style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)', padding: '2.5rem', borderRadius: '12px', borderTop: '3px solid #102C51', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ color: '#102C51', fontSize: '1.3rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>O que está Incluso?</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {["Professor mestrando em filosofia", "Aula filosófica", "Guia de montanha", "Acesso ao Lavandário", "Transporte executivo", "Uma das melhores vistas do Brasil"].map((item, i) => (
                        <li key={i} style={{ color: '#B0B0B0', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#102C51', fontWeight: 'bold' }}>✓</span> {item}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal delay={400}>
                  <div className="logistics-card" style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)', padding: '2.5rem', borderRadius: '12px', borderTop: '3px solid #102C51', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ color: '#102C51', fontSize: '1.3rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Para Quem é Isso?</h4>
                    <p style={{ color: '#B0B0B0', lineHeight: '1.7' }}>Para mentes inquietas, entusiastas de desafios e qualquer um que sinta que o crescimento pessoal exige tanto esforço físico quanto mental.</p>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* FAQ */}
            <section className="faq-section" id="faq">
              <h2 className="section-title">Perguntas Frequentes</h2>
              <div className="faq-list" style={{ maxWidth: '800px', margin: '4rem auto 0 auto' }}>
                {[
                  { question: "Qual o real nível de dificuldade?", answer: "A Pedra da Macela é classificada como moderada. São 2km de subida muito íngreme." },
                  { question: "É preciso ter lido Platão?", answer: "Não. A aula é acessível a todos." },
                  { question: "Como funciona a caminhada no escuro?", answer: "Subiremos na madrugada com lanternas." },
                  { question: "O que acontece em caso de chuva?", answer: "Se houver risco de segurança, a trilha será remarcada." },
                  { question: "O transporte está incluso?", answer: "Sim, transporte executivo ida e volta incluso." }
                ].map((item, i) => (
                  <details key={i} className="faq-item" style={{ marginBottom: '1rem', backgroundColor: 'rgba(26, 26, 26, 0.4)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <summary
                      className="faq-question"
                      style={{ padding: '1.5rem', cursor: 'pointer', fontWeight: '600', color: '#FFF' }}
                    >
                      {item.question} <span style={{ color: '#102C51', float:'right' }}>+</span>
                    </summary>
                    <div className="faq-answer" style={{ padding: '1rem 1.5rem', color: '#B0B0B0' }}>
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* POLÍTICAS */}
            <section className="policy-section" style={{ background: 'none', padding: '4rem 5%', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div className="policy-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h4 style={{ color: 'white', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Cancelamentos e desistências</h4>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>O valor em percentual a ser restituído será de acordo com a deliberação normativa nº161 da Embratur de 09 de agosto de 1985:</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  <li style={{ color: '#B0B0B0', fontSize: '0.85rem' }}><span style={{ color: '#102C51', fontWeight: 'bold' }}>90%</span> — até 31 dias</li>
                  <li style={{ color: '#B0B0B0', fontSize: '0.85rem' }}><span style={{ color: '#102C51', fontWeight: 'bold' }}>80%</span> — 21 a 30 dias</li>
                  <li style={{ color: '#B0B0B0', fontSize: '0.85rem' }}><span style={{ color: '#102C51', fontWeight: 'bold' }}>0%</span> — menos de 20 dias</li>
                </ul>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Em caso de cancelamento da excursão por parte do prestador, todos os passageiros serão avisados com antecedência mínima de 48 horas do embarque e o valor total pago pela excursão será restituído aos clientes, sem direito a qualquer tipo de indenização.

</p>
              </div>
            </section>

            <footer className="main-footer">
              <div className="footer-copyright">
                <p>&copy; 2026 Ascensão e Eros. Criado por Ravin Mor.</p>
              </div>
            </footer>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default App;