import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";
import { useContent } from "../content/ContentContext";

interface TimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Converte a data digitada (BR "DD/MM/AAAA" ou ISO "AAAA-MM-DD") em Date local. */
function parseStartDate(value: string): Date {
  const v = (value || "").trim();
  let y = 2022,
    m = 10,
    d = 8;

  if (v.includes("/")) {
    // Padrão brasileiro: DD/MM/AAAA
    const [dd, mm, yy] = v.split("/").map((n) => parseInt(n, 10));
    if (dd) d = dd;
    if (mm) m = mm;
    if (yy) y = yy;
  } else if (v.includes("-")) {
    // Padrão ISO: AAAA-MM-DD
    const [yy, mm, dd] = v.split("-").map((n) => parseInt(n, 10));
    if (yy) y = yy;
    if (mm) m = mm;
    if (dd) d = dd;
  }

  return new Date(y, m - 1, d, 0, 0, 0);
}

export default function LoveCounter() {
  const { general } = useContent();
  const [timeDiff, setTimeDiff] = useState<TimeDiff>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Aceita data no padrão BR "DD/MM/AAAA" ou ISO "AAAA-MM-DD".
    const start = parseStartDate(general.startDate);

    const calculateTime = () => {
      const now = new Date();

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        // Borrow days from previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }

      if (months < 0) {
        months += 12;
        years--;
      }

      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
        // Re-borrow if days goes negative due to hours offset
        if (days < 0) {
          const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
          days += prevMonth.getDate();
          months--;
          if (months < 0) {
            months += 12;
            years--;
          }
        }
      }

      setTimeDiff({ years, months, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [general.startDate]);

  const timeFields = [
    { value: timeDiff.years, label: "Anos", color: "text-dourado text-glow-dourado" },
    { value: timeDiff.months, label: "Meses", color: "text-rosa text-glow-rosa" },
    { value: timeDiff.days, label: "Dias", color: "text-dourado text-glow-dourado" },
    { value: timeDiff.hours, label: "Horas", color: "text-rosa text-glow-rosa" },
    { value: timeDiff.minutes, label: "Minutos", color: "text-dourado text-glow-dourado" },
    { value: timeDiff.seconds, label: "Segundos", color: "text-rosa text-glow-rosa" },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Background visual details */}
      <div className="absolute inset-0 radial-glow-vinho opacity-55 z-0 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] radial-glow-rosa opacity-10 z-0 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 select-none">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-rosa font-medium mb-3 block">
            Nossa Eternidade em Números
          </span>
          <h2 className="text-3xl md:text-5xl font-title font-light tracking-tight text-brancoQuente">
            Contador do nosso <span className="italic text-dourado font-normal font-serif">amor</span>
          </h2>
          <div className="w-12 h-[1px] bg-dourado/50 mx-auto mt-6" />
        </div>

        {/* Counter Grid */}
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 shadow-[0_25px_60px_rgba(8,6,7,0.7)] relative overflow-hidden">
          
          {/* Subtle gold line accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-vinho-light via-dourado to-vinho-light" />
          
          <div className="flex items-center gap-3 justify-center mb-10 text-brancoQuente/50 text-xs md:text-sm uppercase tracking-[0.2em] font-mono">
            <Clock className="w-4 h-4 text-rosa" />
            <span>Tempo decorrido desde {general.startDateLabel}</span>
            <Calendar className="w-4 h-4 text-dourado" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {timeFields.map((field, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl bg-black/40 border border-white/5 shadow-inner group hover:border-rosa/20 transition-all duration-300"
              >
                <span className={`text-4xl md:text-5xl lg:text-6xl font-title font-light mb-2 tabular-nums ${field.color}`}>
                  {String(field.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-brancoQuente/50 group-hover:text-brancoQuente transition-colors">
                  {field.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
