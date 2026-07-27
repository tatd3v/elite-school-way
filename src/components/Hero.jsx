export default function Hero({ onOpenModal }) {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/40 z-10"></div>
        <img 
          className="w-full h-full object-cover grayscale-[0.3]" 
          alt="Elite Way School Grand Library" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrYe4YI04TTeB2TUw4ubf-03dlsgfdlbrR8YRpfdS1uA-OqbW0VahESdECCYs_K89QwY0n1B4Vx0yhYlL7N-8hTCqJ2kv8QcOwiLX0kofdXAX7ocAJxeGjAHgW6Nr07tNHbUrccyBWxCn_jhN-P4AKPFPMsujT-Yak6HMwYPsbzvmRn7OfNuEGhu-8Wz68rWtctJGQgjl8otStVt_PbJ3t-RecGMRQWLi2IBFUf45XAmQ-So3tQ9BtdVZaQV-W-GyodXL8tB7Co6kl"
        />
      </div>
      
      <div className="relative z-20 text-center px-margin-mobile max-w-4xl">
        <img 
          alt="Logo Center" 
          className="w-32 h-32 mx-auto mb-8 drop-shadow-xl animate-pulse" 
          src="https://lh3.googleusercontent.com/aida/AP1WRLuXcw0qGMJ6pITeTn94TSyqfCbzllwT6cPd7A6Mjns63rBxRp5XyQnMGQEpMo87owpMTEsMwQ7nHoGfJEMEiWRFByrz0hHwsgOVlcIx_vLSJ-_x116i-6Vec4HV6-s0K_L28ZKBg7Y0_OhRLbLQQaF78sWlfLV08Tcbzl1lWttsOvhyY_0nA4CaOqpxZSdq4CtzfDZ3Sj0S9xj5jcsohnTfbRSvQApDfQNGPEmZdMgJWUuuQNkqResbd33-"
        />
        
        <h1 className="font-headline text-display-lg text-on-secondary mb-4 uppercase leading-tight">
          BIENVENIDOS A LA LEGENDARIA<br />
          <span className="text-secondary-fixed">ELITE WAY SCHOOL</span>
        </h1>
        
        <p className="font-body text-body-lg text-primary-fixed mb-12 max-w-2xl mx-auto">
          No pierdas la oportunidad de ser parte de la historia. Las admisiones están abiertas por tiempo limitado.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            className="bg-secondary text-on-secondary px-8 py-4 font-headline text-label-lg uppercase tracking-widest hover:bg-secondary/90 transition-all border border-secondary rounded"
            onClick={onOpenModal}
          >
            Inscríbete Ya!
          </button>
          <a 
            className="bg-transparent border-2 border-white/30 text-white px-8 py-4 font-headline text-label-lg uppercase tracking-widest hover:bg-white/10 transition-all rounded" 
            href="#event"
          >
            Explorar Evento
          </a>
        </div>
      </div>
    </section>
  )
}
