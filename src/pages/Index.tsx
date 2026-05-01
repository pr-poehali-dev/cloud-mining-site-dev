import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const SEND_LEAD_URL = "https://functions.poehali.dev/e213faec-7ed5-471a-83d8-c3d37e9af8f9";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/867746d1-07ee-497e-b249-d611b9c67f5c/files/dcd7bfbb-1160-41b3-a990-5f86eafd7c20.jpg";
const DASHBOARD_IMAGE = "https://cdn.poehali.dev/projects/867746d1-07ee-497e-b249-d611b9c67f5c/files/9ef04517-20fb-4652-a88e-662ab9f0cd3a.jpg";

const NAV_LINKS = [
  { href: "#about", label: "О платформе" },
  { href: "#tariffs", label: "Тарифы" },
  { href: "#howto", label: "Как начать" },
  { href: "#stats", label: "Статистика" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Контакты" },
];

const TARIFFS = [
  {
    name: "Старт",
    price: "500",
    hashrate: "5 TH/s",
    income: "от $45",
    period: "месяц",
    color: "from-coal-600 to-coal-700",
    border: "border-coal-500",
    popular: false,
    features: ["Bitcoin (BTC)", "5 TH/s мощность", "Ежедневные выплаты", "Базовая поддержка"],
  },
  {
    name: "Профи",
    price: "2 500",
    hashrate: "30 TH/s",
    income: "от $280",
    period: "месяц",
    color: "from-gold-dark to-gold",
    border: "border-gold",
    popular: true,
    features: ["BTC + ETH + LTC", "30 TH/s мощность", "Ежедневные выплаты", "Приоритетная поддержка", "Панель аналитики"],
  },
  {
    name: "Элит",
    price: "10 000",
    hashrate: "150 TH/s",
    income: "от $1 400",
    period: "месяц",
    color: "from-[#0a1628] to-[#0d1f3c]",
    border: "border-neon-blue",
    popular: false,
    features: ["Все монеты", "150 TH/s мощность", "Мгновенные выплаты", "VIP поддержка 24/7", "Расширенная аналитика", "Личный менеджер"],
  },
];

const STATS = [
  { value: 12480, suffix: "+", label: "Активных клиентов", icon: "Users" },
  { value: 99.8, suffix: "%", label: "Uptime платформы", icon: "Activity", decimal: 1 },
  { value: 847, suffix: " BTC", label: "Выплачено за год", icon: "Bitcoin" },
  { value: 6, suffix: " лет", label: "На рынке", icon: "Shield" },
];

const FAQ_ITEMS = [
  {
    q: "Как работает облачный майнинг?",
    a: "Вы арендуете вычислительные мощности на наших дата-центрах. Оборудование работает круглосуточно, а добытые монеты автоматически поступают на ваш счёт.",
  },
  {
    q: "Когда я получу первые выплаты?",
    a: "Первые выплаты начисляются уже через 24 часа после активации контракта. Вы можете настроить автоматический вывод на любой удобный кошелёк.",
  },
  {
    q: "Насколько безопасна платформа?",
    a: "Мы используем 256-битное шифрование, двухфакторную аутентификацию и холодное хранение средств. За 6 лет работы — ни одного инцидента безопасности.",
  },
  {
    q: "Можно ли увеличить мощность?",
    a: "Да, вы можете в любой момент перейти на более высокий тариф или докупить дополнительные мощности через личный кабинет.",
  },
  {
    q: "Какова минимальная сумма вывода?",
    a: "Минимальная сумма вывода — $10 или эквивалент в криптовалюте. Вывод обрабатывается в течение 1-3 часов.",
  },
];

const STEPS = [
  { num: "01", title: "Зарегистрируйтесь", desc: "Создайте аккаунт за 2 минуты. Верификация не требуется для старта.", icon: "UserPlus" },
  { num: "02", title: "Выберите тариф", desc: "Подберите мощность под ваши цели и бюджет. Начать можно с $500.", icon: "LayoutGrid" },
  { num: "03", title: "Пополните счёт", desc: "Переведите средства в крипто или фиате удобным способом.", icon: "Wallet" },
  { num: "04", title: "Получайте доход", desc: "Оборудование заработает сразу. Следите за прибылью в реальном времени.", icon: "TrendingUp" },
];

function useCountUp(target: number, duration = 2000, decimal = 0) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((ease * target).toFixed(decimal)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration, decimal]);

  return { value, ref };
}

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  const { value, ref } = useCountUp(stat.value, 2200, stat.decimal ?? 0);
  return (
    <div ref={ref} className="text-center p-8 rounded-2xl bg-coal-700 border border-coal-500 hover:border-gold/50 transition-all duration-300 group">
      <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
        <Icon name={stat.icon} size={24} className="text-gold" />
      </div>
      <div className="font-oswald text-4xl font-bold text-white mb-1">
        {stat.decimal ? value.toFixed(stat.decimal) : Math.round(value)}{stat.suffix}
      </div>
      <div className="text-gray-400 font-golos text-sm">{stat.label}</div>
    </div>
  );
}

const TICKER_NAMES = ["Александр М.", "Елена К.", "Дмитрий В.", "Ольга Н.", "Сергей П.", "Анна Р.", "Михаил Т.", "Наталья С.", "Иван Ф.", "Мария Л.", "Артём Ш.", "Юлия Д.", "Андрей З.", "Кристина Е.", "Роман Б."];
const TICKER_CITIES = ["Москва", "СПб", "Казань", "Краснодар", "Екб", "Новосибирск", "Минск", "Алматы", "Киев", "Ташкент", "Баку", "Тбилиси"];
const TICKER_COINS = ["BTC", "ETH", "LTC"];

function generateTicker() {
  const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
  const city = TICKER_CITIES[Math.floor(Math.random() * TICKER_CITIES.length)];
  const coin = TICKER_COINS[Math.floor(Math.random() * TICKER_COINS.length)];
  const amount = (Math.random() * 1800 + 80).toFixed(0);
  return `${name} из ${city} получил +$${amount} (${coin})`;
}

function PaymentTicker() {
  const COUNT = 18;
  const [items] = useState(() => Array.from({ length: COUNT }, generateTicker));

  return (
    <div className="w-full overflow-hidden bg-coal-800/90 border-y border-coal-600 backdrop-blur-sm py-2.5 select-none">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-8 font-golos text-sm text-gray-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block shrink-0" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function PaymentToast() {
  const [toast, setToast] = useState<{ name: string; city: string; amount: string; coin: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      const name = TICKER_NAMES[Math.floor(Math.random() * TICKER_NAMES.length)];
      const city = TICKER_CITIES[Math.floor(Math.random() * TICKER_CITIES.length)];
      const coin = TICKER_COINS[Math.floor(Math.random() * TICKER_COINS.length)];
      const amount = (Math.random() * 1800 + 80).toFixed(0);
      setToast({ name, city, amount, coin });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    const id = setInterval(show, 7000);
    const first = setTimeout(show, 2500);
    return () => { clearInterval(id); clearTimeout(first); };
  }, []);

  if (!toast) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="flex items-center gap-3 bg-coal-700 border border-coal-500 rounded-2xl px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-sm max-w-xs">
        <div className="w-9 h-9 bg-green-400/15 border border-green-400/30 rounded-xl flex items-center justify-center shrink-0">
          <Icon name="TrendingUp" size={16} className="text-green-400" />
        </div>
        <div>
          <div className="font-golos text-white text-sm font-medium leading-tight">
            {toast.name} из {toast.city}
          </div>
          <div className="font-golos text-green-400 text-sm font-bold">
            +${toast.amount} <span className="text-gray-500 font-normal">({toast.coin})</span>
          </div>
        </div>
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0 ml-1" />
      </div>
    </div>
  );
}

function useLiveCounter(base: number, variance: number, interval = 3000) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor((Math.random() - 0.45) * variance);
      setValue((v) => Math.max(base - variance * 2, v + delta));
    }, interval);
    return () => clearInterval(id);
  }, [base, variance, interval]);
  return value;
}

function LiveStats() {
  const users = useLiveCounter(14_382, 3, 4200);
  const [paid, setPaid] = useState(2_847_913);
  const [hashrate, setHashrate] = useState(98.7);
  const [lastTx, setLastTx] = useState({ amount: 0.0432, ago: 12 });

  useEffect(() => {
    const id = setInterval(() => {
      setPaid((v) => v + Math.floor(Math.random() * 120 + 40));
      setHashrate((v) => parseFloat((v + (Math.random() - 0.5) * 0.4).toFixed(1)));
      if (Math.random() > 0.6) {
        setLastTx({ amount: parseFloat((Math.random() * 0.08 + 0.01).toFixed(4)), ago: Math.floor(Math.random() * 30 + 5) });
      }
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.9s" }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        {/* Активные пользователи */}
        <div className="bg-coal-700/80 border border-coal-500 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-golos text-xs text-gray-500">Онлайн</span>
          </div>
          <div className="font-oswald text-2xl font-bold text-white tabular-nums">
            {users.toLocaleString("ru")}
          </div>
          <div className="font-golos text-xs text-gray-400 mt-0.5">пользователей</div>
        </div>

        {/* Выплачено */}
        <div className="bg-coal-700/80 border border-coal-500 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="TrendingUp" size={12} className="text-gold" />
            <span className="font-golos text-xs text-gray-500">Выплачено</span>
          </div>
          <div className="font-oswald text-2xl font-bold text-gold tabular-nums">
            ${paid.toLocaleString("ru")}
          </div>
          <div className="font-golos text-xs text-gray-400 mt-0.5">за всё время</div>
        </div>

        {/* Хэшрейт */}
        <div className="bg-coal-700/80 border border-coal-500 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="Cpu" size={12} className="text-neon-blue" />
            <span className="font-golos text-xs text-gray-500">Хэшрейт</span>
          </div>
          <div className="font-oswald text-2xl font-bold text-white tabular-nums">
            {hashrate} <span className="text-sm font-normal text-gray-400">PH/s</span>
          </div>
          <div className="font-golos text-xs text-gray-400 mt-0.5">сейчас</div>
        </div>

        {/* Последняя выплата */}
        <div className="bg-coal-700/80 border border-coal-500 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="Zap" size={12} className="text-neon-cyan" />
            <span className="font-golos text-xs text-gray-500">Выплата</span>
          </div>
          <div className="font-oswald text-2xl font-bold text-white tabular-nums">
            +{lastTx.amount} <span className="text-sm font-normal text-gray-400">BTC</span>
          </div>
          <div className="font-golos text-xs text-gray-400 mt-0.5">{lastTx.ago} сек назад</div>
        </div>
      </div>
    </div>
  );
}

function TariffModal({ tariff, onClose }: { tariff: (typeof TARIFFS)[0]; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", contact: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setErrorMsg("Пожалуйста, заполните имя и контакт");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(SEND_LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          budget: `Тариф «${tariff.name}» — $${tariff.price}`,
          message: `Выбранный тариф: ${tariff.name} (${tariff.hashrate}), доход ${tariff.income}/${tariff.period}`,
        }),
      });
      if (res.ok || res.status === 207) {
        setStatus("success");
      } else {
        throw new Error();
      }
    } catch {
      setStatus("error");
      setErrorMsg("Не удалось отправить заявку. Попробуйте позже.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-coal-700 border border-coal-500 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-scale-in">
        {status === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-400/10 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <h3 className="font-oswald text-2xl font-bold text-white mb-3">Заявка отправлена!</h3>
            <p className="font-golos text-gray-400 mb-2">Тариф <span className="text-gold font-semibold">«{tariff.name}»</span> выбран.</p>
            <p className="font-golos text-gray-400 mb-6">Мы свяжемся с вами в течение 15 минут.</p>
            <button onClick={onClose} className="font-golos text-gold border border-gold/30 px-6 py-2.5 rounded-xl hover:bg-gold/10 transition-colors">
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-oswald text-2xl font-bold text-white">Оформить тариф</h3>
                <p className="font-golos text-gray-400 text-sm mt-1">Мы свяжемся и проведём вас по шагам</p>
              </div>
              <button type="button" onClick={onClose} className="text-gray-500 hover:text-white transition-colors mt-1">
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="bg-coal-600 border border-gold/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-oswald text-lg font-bold text-white">{tariff.name}</div>
                <div className="font-golos text-gold text-sm">Доход {tariff.income} / {tariff.period}</div>
              </div>
              <div className="font-oswald text-2xl font-bold text-white">${tariff.price}</div>
            </div>
            <div>
              <label className="font-golos text-sm text-gray-400 mb-1.5 block">Ваше имя *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Как к вам обращаться"
                className="w-full bg-coal-600 border border-coal-500 rounded-xl px-4 py-3 font-golos text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="font-golos text-sm text-gray-400 mb-1.5 block">Телефон / Telegram *</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="+7 или @username"
                className="w-full bg-coal-600 border border-coal-500 rounded-xl px-4 py-3 font-golos text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            {errorMsg && (
              <div className="flex items-center gap-2 text-red-400 font-golos text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} />
                {errorMsg}
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gold text-coal-DEFAULT font-golos font-bold py-4 rounded-xl hover:bg-gold-light transition-all duration-200 hover:scale-105 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <><Icon name="Loader2" size={18} className="animate-spin" />Отправляем...</>
              ) : "Подать заявку"}
            </button>
            <p className="font-golos text-xs text-gray-600 text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
          </form>
        )}
      </div>
    </div>
  );
}

function TariffsSection({ onSelect }: { onSelect: (t: (typeof TARIFFS)[0]) => void }) {
  return (
    <section id="tariffs" className="py-24 bg-coal-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">Тарифы</div>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">ВЫБЕРИТЕ СВОЙ <span className="text-gold">ПЛАН</span></h2>
          <p className="font-golos text-gray-400 max-w-xl mx-auto">Гибкие контракты под любой бюджет. Начните с малого и масштабируйтесь вместе с доходом.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TARIFFS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border-2 ${t.border} overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                t.popular ? "shadow-gold/20 shadow-xl scale-105" : ""
              }`}
            >
              {t.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gold text-center py-2">
                  <span className="font-golos text-xs font-bold text-coal-DEFAULT tracking-widest uppercase">Популярный выбор</span>
                </div>
              )}
              <div className={`bg-gradient-to-br ${t.color} p-8 ${t.popular ? "pt-12" : ""}`}>
                <div className="font-oswald text-2xl font-bold text-white mb-1">{t.name}</div>
                <div className="font-golos text-gray-400 text-sm mb-6">{t.hashrate}</div>
                <div className="mb-2">
                  <span className="font-oswald text-5xl font-bold text-white">${t.price}</span>
                  <span className="font-golos text-gray-400 text-sm ml-2">инвестиция</span>
                </div>
                <div className="font-golos text-gold font-semibold text-lg mb-6">Доход {t.income} / {t.period}</div>
                <ul className="space-y-3 mb-8">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 font-golos text-sm text-gray-300">
                      <Icon name="Check" size={16} className="text-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onSelect(t)}
                  className={`w-full py-3.5 rounded-xl font-golos font-bold text-sm transition-all hover:scale-105 ${
                    t.popular
                      ? "bg-coal-DEFAULT text-gold border-2 border-gold hover:bg-coal-700"
                      : "bg-gold text-coal-DEFAULT hover:bg-gold-light"
                  }`}
                >
                  Выбрать тариф
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", contact: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) {
      setErrorMsg("Пожалуйста, заполните имя и контакт");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(SEND_LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok || res.status === 207) {
        setStatus("success");
        setForm({ name: "", contact: "", budget: "", message: "" });
      } else {
        throw new Error("Ошибка сервера");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Не удалось отправить заявку. Попробуйте позже.");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">Контакты</div>
        <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-6">ГОТОВЫ <span className="text-gold">НАЧАТЬ?</span></h2>
        <p className="font-golos text-gray-400 text-lg mb-8 leading-relaxed">
          Оставьте заявку, и наш менеджер свяжется с вами в течение 15 минут. Бесплатная консультация по выбору тарифа.
        </p>
        <div className="space-y-4 mb-8">
          {[
            { icon: "MessageSquare", text: "@Artem299999", label: "Telegram" },
            { icon: "Mail", text: "sadkovartem2004@gmail.com", label: "Email" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 p-4 bg-coal-700 rounded-xl border border-coal-500 hover:border-gold/30 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center border border-gold/30 group-hover:bg-gold/20 transition-colors">
                <Icon name={c.icon} size={18} className="text-gold" />
              </div>
              <div>
                <div className="font-golos text-xs text-gray-500">{c.label}</div>
                <div className="font-golos text-white font-medium">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-coal-700 rounded-3xl border border-coal-500 p-8">
        {status === "success" ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-400/10 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={32} className="text-green-400" />
            </div>
            <h3 className="font-oswald text-2xl font-bold text-white mb-3">Заявка отправлена!</h3>
            <p className="font-golos text-gray-400 mb-6">Мы получили вашу заявку и свяжемся с вами в течение 15 минут.</p>
            <button
              onClick={() => setStatus("idle")}
              className="font-golos text-gold border border-gold/30 px-6 py-2.5 rounded-xl hover:bg-gold/10 transition-colors"
            >
              Отправить ещё
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-oswald text-2xl font-bold text-white mb-6">Получить консультацию</h3>
            <div>
              <label className="font-golos text-sm text-gray-400 mb-1.5 block">Имя *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ваше имя"
                className="w-full bg-coal-600 border border-coal-500 rounded-xl px-4 py-3 font-golos text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="font-golos text-sm text-gray-400 mb-1.5 block">Телефон / Telegram *</label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="+7 или @username"
                className="w-full bg-coal-600 border border-coal-500 rounded-xl px-4 py-3 font-golos text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
            <div>
              <label className="font-golos text-sm text-gray-400 mb-1.5 block">Сумма инвестиции</label>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full bg-coal-600 border border-coal-500 rounded-xl px-4 py-3 font-golos text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none"
              >
                <option value="">Выберите диапазон</option>
                <option>$500 — $2 000</option>
                <option>$2 000 — $10 000</option>
                <option>$10 000 — $50 000</option>
                <option>Более $50 000</option>
              </select>
            </div>
            <div>
              <label className="font-golos text-sm text-gray-400 mb-1.5 block">Сообщение (необязательно)</label>
              <textarea
                rows={3}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Ваш вопрос или пожелание..."
                className="w-full bg-coal-600 border border-coal-500 rounded-xl px-4 py-3 font-golos text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
            </div>
            {errorMsg && (
              <div className="flex items-center gap-2 text-red-400 font-golos text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <Icon name="AlertCircle" size={16} />
                {errorMsg}
              </div>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gold text-coal-DEFAULT font-golos font-bold py-4 rounded-xl hover:bg-gold-light transition-all duration-200 hover:scale-105 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Отправляем...
                </>
              ) : (
                "Отправить заявку"
              )}
            </button>
            <p className="font-golos text-xs text-gray-600 text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
          </form>
        )}
      </div>
    </div>
  );
}

function Calculator() {
  const [amount, setAmount] = useState(2500);
  const [period, setPeriod] = useState(12);
  const [coin, setCoin] = useState("BTC");

  const rates: Record<string, { daily: number; label: string }> = {
    BTC: { daily: 0.0000034, label: "Bitcoin" },
    ETH: { daily: 0.000045, label: "Ethereum" },
    LTC: { daily: 0.0012, label: "Litecoin" },
  };

  const hashrate = amount / 500 * 5;
  const dailyUSD = (amount / 500) * 3.8;
  const totalUSD = dailyUSD * period * 30;
  const profit = totalUSD - amount;
  const roi = ((profit / amount) * 100).toFixed(0);

  const chartBars = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    value: i < period ? Math.min(100, 20 + i * 7 + Math.sin(i) * 5) : 0,
    active: i < period,
  }));

  return (
    <div className="bg-coal-700 rounded-3xl border border-coal-500 overflow-hidden">
      <div className="p-8 grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="font-golos text-sm text-gray-400 mb-2 block">Сумма инвестиции</label>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-oswald text-3xl font-bold text-gold">${amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="w-full h-2 bg-coal-500 rounded-full appearance-none cursor-pointer accent-gold"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1 font-golos">
              <span>$500</span><span>$50 000</span>
            </div>
          </div>
          <div>
            <label className="font-golos text-sm text-gray-400 mb-3 block">Криптовалюта</label>
            <div className="flex gap-2">
              {Object.entries(rates).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setCoin(k)}
                  className={`px-4 py-2 rounded-xl font-golos text-sm font-medium transition-all ${
                    coin === k
                      ? "bg-gold text-coal-DEFAULT"
                      : "bg-coal-600 text-gray-400 hover:text-white border border-coal-500"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-golos text-sm text-gray-400 mb-2 block">Период: {period} мес.</label>
            <input
              type="range"
              min={1}
              max={24}
              value={period}
              onChange={(e) => setPeriod(+e.target.value)}
              className="w-full h-2 bg-coal-500 rounded-full appearance-none cursor-pointer accent-neon-blue"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1 font-golos">
              <span>1 мес.</span><span>24 мес.</span>
            </div>
          </div>
          <div className="bg-coal-600 rounded-2xl p-4 space-y-3 border border-coal-500">
            <div className="flex justify-between items-center">
              <span className="font-golos text-sm text-gray-400">Мощность</span>
              <span className="font-oswald text-white font-bold">{hashrate.toFixed(0)} TH/s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-golos text-sm text-gray-400">Доход в день</span>
              <span className="font-oswald text-neon-cyan font-bold">~${dailyUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-golos text-sm text-gray-400">Общий доход</span>
              <span className="font-oswald text-gold font-bold text-xl">~${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="h-px bg-coal-500" />
            <div className="flex justify-between items-center">
              <span className="font-golos text-sm text-gray-400">Чистая прибыль</span>
              <span className={`font-oswald font-bold text-xl ${profit > 0 ? "text-green-400" : "text-red-400"}`}>
                {profit > 0 ? "+" : ""}${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-golos text-sm text-gray-400">ROI</span>
              <span className={`font-oswald font-bold ${profit > 0 ? "text-green-400" : "text-red-400"}`}>{roi}%</span>
            </div>
          </div>
        </div>
        <div>
          <div className="font-golos text-sm text-gray-400 mb-4">Прогноз прибыли по месяцам</div>
          <div className="h-48 flex items-end gap-1.5">
            {chartBars.map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${bar.value}%`,
                    background: bar.active
                      ? `linear-gradient(to top, #C9952A, #F5C542)`
                      : "#1E2233",
                    opacity: bar.active ? 1 : 0.3,
                  }}
                />
                <span className="text-xs text-gray-600 font-golos">{bar.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-2xl bg-gold/10 border border-gold/30">
            <div className="font-golos text-gold text-sm font-medium mb-1">💡 Рекомендация</div>
            <div className="font-golos text-gray-300 text-sm">
              При инвестиции ${amount.toLocaleString()} на {period} мес. вы заработаете{" "}
              <span className="text-gold font-semibold">~${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>,
              что составит <span className="text-green-400 font-semibold">{roi}% ROI</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [modalTariff, setModalTariff] = useState<(typeof TARIFFS)[0] | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-coal-DEFAULT font-golos text-white overflow-x-hidden">
      {/* Фоновые декорации */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />
      </div>

      {/* НАВИГАЦИЯ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-coal-800/95 backdrop-blur-md border-b border-coal-600" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-coal-DEFAULT" />
            </div>
            <span className="font-oswald text-xl font-bold tracking-wider text-white">HASH<span className="text-gold">VAULT</span></span>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="font-golos text-sm text-gray-400 hover:text-gold transition-colors">
                {l.label}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button className="font-golos text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">Войти</button>
            <button onClick={() => setModalTariff(TARIFFS[0])} className="font-golos text-sm bg-gold text-coal-DEFAULT font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors animate-glow-pulse">
              Начать бесплатно
            </button>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-coal-800 border-t border-coal-600 px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="block w-full text-left font-golos text-gray-300 hover:text-gold py-2 transition-colors">
                {l.label}
              </button>
            ))}
            <button onClick={() => { setMobileOpen(false); setModalTariff(TARIFFS[0]); }} className="w-full mt-3 bg-gold text-coal-DEFAULT font-golos font-semibold py-3 rounded-xl hover:bg-gold-light transition-colors">
              Начать бесплатно
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Mining" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-coal-DEFAULT via-coal-DEFAULT/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-coal-DEFAULT via-transparent to-coal-DEFAULT/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-golos text-sm text-gold">Платформа работает 24/7 · 99.8% uptime</span>
            </div>
            <h1 className="font-oswald text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              МАЙНИ<br />
              <span className="text-gold">КРИПТОВАЛЮТУ</span><br />
              БЕЗ УСИЛИЙ
            </h1>
            <p className="font-golos text-lg text-gray-300 mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Профессиональная облачная платформа с мощностью от 5 до 1000+ TH/s.
              Начните зарабатывать уже через 24 часа — без оборудования и технических знаний.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <button
                onClick={() => setModalTariff(TARIFFS[1])}
                className="bg-gold text-coal-DEFAULT font-golos font-bold px-8 py-4 rounded-xl hover:bg-gold-light transition-all duration-200 hover:scale-105 flex items-center gap-2 text-base"
              >
                Выбрать тариф
                <Icon name="ArrowRight" size={18} />
              </button>
              <button
                onClick={() => scrollTo("#calc")}
                className="border border-coal-500 text-white font-golos font-medium px-8 py-4 rounded-xl hover:border-gold/50 hover:bg-coal-700 transition-all duration-200 flex items-center gap-2 text-base"
              >
                <Icon name="Calculator" size={18} className="text-gold" />
                Рассчитать доход
              </button>
            </div>
            <div className="flex flex-wrap gap-6 mt-8 animate-fade-in" style={{ animationDelay: "0.7s" }}>
              {[
                { icon: "Shield", text: "Гарантия безопасности" },
                { icon: "Clock", text: "Выплаты 24/7" },
                { icon: "TrendingUp", text: "До +280% ROI" },
              ].map((item) => (
                <div key={item.icon} className="flex items-center gap-2 text-gray-400">
                  <Icon name={item.icon} size={16} className="text-gold" />
                  <span className="font-golos text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <LiveStats />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block w-1/3 pr-12 animate-float">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-3xl blur-2xl" />
            <img src={DASHBOARD_IMAGE} alt="Dashboard" className="relative rounded-3xl border border-gold/20 shadow-2xl w-full" />
          </div>
        </div>
      </section>

      <PaymentTicker />

      {/* О ПЛАТФОРМЕ */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">О платформе</div>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">ПОЧЕМУ ВЫБИРАЮТ <span className="text-gold">HASHVAULT</span></h2>
          <p className="font-golos text-gray-400 max-w-xl mx-auto">
            Мы работаем с 2018 года и обеспечиваем клиентам стабильный пассивный доход через профессиональный облачный майнинг.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "Cpu", title: "Топовое оборудование", desc: "Антмайнеры S19 Pro и S21 последнего поколения. Эффективность 32 Дж/TH — лучшее на рынке.", color: "text-gold" },
            { icon: "Globe", title: "Дата-центры по всему миру", desc: "3 собственных объекта в Исландии, Казахстане и ОАЭ. Дешёвая электроэнергия — выше прибыль.", color: "text-neon-blue" },
            { icon: "BarChart3", title: "Прозрачная аналитика", desc: "Личный кабинет с реал-тайм графиками, историей выплат и детальной статистикой.", color: "text-neon-cyan" },
            { icon: "Lock", title: "Максимальная защита", desc: "2FA, холодные кошельки, страховой фонд 5% от оборота. Ваши средства под полной защитой.", color: "text-gold" },
            { icon: "Zap", title: "Быстрый старт", desc: "Регистрация — 2 минуты. Первый платёж — через 24 часа. Никакого оборудования и технических знаний.", color: "text-neon-blue" },
            { icon: "HeadphonesIcon", title: "Поддержка 24/7", desc: "Русскоязычная команда в Telegram, email и онлайн-чате. Среднее время ответа — 4 минуты.", color: "text-neon-cyan" },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-2xl bg-coal-700 border border-coal-500 hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl bg-coal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon name={item.icon} size={22} className={item.color} />
              </div>
              <h3 className="font-oswald text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="font-golos text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ТАРИФЫ */}
      <TariffsSection onSelect={setModalTariff} />


      {/* КАЛЬКУЛЯТОР */}
      <section id="calc" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">Калькулятор</div>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">РАССЧИТАЙТЕ <span className="text-gold">ДОХОДНОСТЬ</span></h2>
          <p className="font-golos text-gray-400 max-w-xl mx-auto">Узнайте, сколько вы заработаете при разных суммах и сроках. Расчёт на основе актуальных данных рынка.</p>
        </div>
        <Calculator />
      </section>

      {/* КАК НАЧАТЬ */}
      <section id="howto" className="py-24 bg-coal-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">Как начать</div>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">4 ШАГА ДО <span className="text-gold">ПЕРВОГО ДОХОДА</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gold/50 to-transparent z-10" />
                )}
                <div className="bg-coal-700 border border-coal-500 rounded-2xl p-6 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="font-oswald text-6xl font-bold text-coal-500 mb-4 leading-none">{step.num}</div>
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-4 border border-gold/30">
                    <Icon name={step.icon} size={20} className="text-gold" />
                  </div>
                  <h3 className="font-oswald text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="font-golos text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="bg-gold text-coal-DEFAULT font-golos font-bold px-10 py-4 rounded-xl hover:bg-gold-light transition-all duration-200 hover:scale-105 text-base inline-flex items-center gap-2">
              Начать сейчас
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* СТАТИСТИКА */}
      <section id="stats" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">Статистика</div>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">ЦИФРЫ ГОВОРЯТ <span className="text-gold">ЗА СЕБЯ</span></h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
        <div className="bg-coal-700 rounded-3xl border border-coal-500 p-8">
          <div className="font-golos text-sm text-gray-400 mb-6">Выплаты платформы — последние 12 месяцев (BTC)</div>
          <div className="h-48 flex items-end gap-2">
            {[42, 48, 55, 51, 63, 70, 68, 79, 85, 91, 88, 98].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md transition-all duration-700"
                  style={{
                    height: `${v}%`,
                    background: i === 11
                      ? "linear-gradient(to top, #00C2FF, #00FFD1)"
                      : "linear-gradient(to top, #C9952A, #F5C542)",
                    opacity: 0.85,
                  }}
                />
                <span className="text-xs text-gray-600 font-golos">
                  {["Я", "Ф", "М", "А", "М", "И", "И", "А", "С", "О", "Н", "Д"][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gold" />
              <span className="font-golos text-sm text-gray-400">Прошлые месяцы</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-neon-blue" />
              <span className="font-golos text-sm text-gray-400">Текущий месяц</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-coal-800">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-golos text-gold text-sm font-medium mb-3 tracking-widest uppercase">FAQ</div>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-4">ЧАСТО ЗАДАВАЕМЫЕ <span className="text-gold">ВОПРОСЫ</span></h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-coal-700 border border-coal-500 rounded-2xl overflow-hidden hover:border-gold/30 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4"
                >
                  <span className="font-golos font-medium text-white">{item.q}</span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={18}
                    className={`text-gold shrink-0 transition-transform ${openFaq === i ? "rotate-0" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 font-golos text-gray-400 text-sm leading-relaxed border-t border-coal-500 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6">
        <ContactSection />
      </section>

      {/* Модальное окно выбора тарифа */}
      {modalTariff && <TariffModal tariff={modalTariff} onClose={() => setModalTariff(null)} />}

      {/* Всплывающие уведомления о выплатах */}
      <PaymentToast />

      {/* FOOTER */}
      <footer className="bg-coal-800 border-t border-coal-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={14} className="text-coal-DEFAULT" />
                </div>
                <span className="font-oswald text-lg font-bold text-white">HASH<span className="text-gold">VAULT</span></span>
              </div>
              <p className="font-golos text-sm text-gray-500 leading-relaxed">Профессиональный облачный майнинг с 2018 года.</p>
            </div>
            {[
              { title: "Платформа", links: ["О нас", "Тарифы", "Статистика", "Блог"] },
              { title: "Поддержка", links: ["FAQ", "Документация", "Контакты", "Статус системы"] },
              { title: "Правовое", links: ["Условия использования", "Политика конфиденциальности", "AML политика"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="font-golos text-sm font-semibold text-gray-300 mb-3">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="font-golos text-sm text-gray-500 hover:text-gold transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-coal-600 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-golos text-sm text-gray-600">© 2024 HashVault. Все права защищены.</p>
            <p className="font-golos text-xs text-gray-700 max-w-md text-center">
              Инвестиции в криптовалюту сопряжены с рисками. Прошлые результаты не гарантируют будущей доходности.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}