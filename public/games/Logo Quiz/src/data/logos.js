export const DIFFICULTIES = [
  {
    id: 'easy',
    title: 'Easy',
    points: '10 pts / Q',
    description: 'World-famous iconic brands with subtle blurs and pixel challenges.',
    color: 'emerald',
    borderColor: 'border-emerald-500/50 hover:border-emerald-400',
    bgGradient: 'from-emerald-950/60 to-slate-900',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'medium',
    title: 'Medium',
    points: '20 pts / Q',
    description: 'Tricky monochrome filters, hidden tiles, and automotive & tech logos.',
    color: 'amber',
    borderColor: 'border-amber-500/50 hover:border-amber-400',
    bgGradient: 'from-amber-950/60 to-slate-900',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'hard',
    title: 'Hard',
    points: '30 pts / Q',
    description: 'Heavy masks, partial fragments, and luxury silhouettes for logo masters.',
    color: 'rose',
    borderColor: 'border-rose-500/50 hover:border-rose-400',
    bgGradient: 'from-rose-950/60 to-slate-900',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
];

export const LOGO_QUESTIONS = [
  // ===================== EASY (12 Brands) =====================
  {
    id: 1,
    brand: 'Nike',
    difficulty: 'easy',
    effect: 'blur',
    effectValue: 12,
    options: ['Nike', 'Adidas', 'Puma', 'Reebok'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#18181B"/>
        <path d="M38 120 C 58 136, 92 144, 134 108 C 172 74, 182 52, 182 52 C 182 52, 130 92, 94 92 C 64 92, 50 82, 38 120 Z" fill="#FFFFFF"/>
      </svg>
    `,
  },
  {
    id: 2,
    brand: 'Apple',
    difficulty: 'easy',
    effect: 'blur',
    effectValue: 12,
    options: ['Apple', 'Microsoft', 'HP', 'Dell'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <path d="M125 36 C129 28 139 24 148 25 C149 35 144 44 139 48 C134 53 124 55 125 36 Z" fill="#F8FAFC"/>
        <path d="M148 102 C148 83 162 74 163 73 C153 59 137 57 131 56 C117 55 104 64 97 64 C89 64 78 56 67 56 C52 56 38 65 30 79 C14 107 26 148 41 170 C49 181 57 192 69 191 C80 190 85 183 98 183 C112 183 116 191 127 191 C139 191 147 180 154 169 C163 156 167 143 167 142 C166 142 148 135 148 102 Z" fill="#F8FAFC"/>
      </svg>
    `,
  },
  {
    id: 3,
    brand: "McDonald's",
    difficulty: 'easy',
    effect: 'mask',
    effectValue: 4,
    options: ["McDonald's", 'Burger King', "Wendy's", 'KFC'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#DC2626"/>
        <path d="M42 165 C42 105 58 45 76 45 C94 45 100 100 100 135 C100 100 106 45 124 45 C142 45 158 105 158 165" stroke="#FBBF24" stroke-width="24" stroke-linecap="round" fill="none"/>
      </svg>
    `,
  },
  {
    id: 4,
    brand: 'Spotify',
    difficulty: 'easy',
    effect: 'blur',
    effectValue: 12,
    options: ['Spotify', 'SoundCloud', 'Deezer', 'Tidal'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#121212"/>
        <circle cx="100" cy="100" r="68" fill="#1DB954"/>
        <path d="M60 84 C85 75 120 76 142 88" stroke="#121212" stroke-width="12" stroke-linecap="round"/>
        <path d="M64 105 C85 97 115 98 136 109" stroke="#121212" stroke-width="10" stroke-linecap="round"/>
        <path d="M68 126 C85 120 110 120 128 129" stroke="#121212" stroke-width="8" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: 5,
    brand: 'Adidas',
    difficulty: 'easy',
    effect: 'partial-reveal',
    effectValue: 40,
    options: ['Adidas', 'Puma', 'Under Armour', 'Nike'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <polygon points="45,155 75,155 105,75 75,75" fill="#FFFFFF"/>
        <polygon points="85,155 115,155 145,50 115,50" fill="#FFFFFF"/>
        <polygon points="125,155 155,155 175,95 145,95" fill="#FFFFFF"/>
      </svg>
    `,
  },
  {
    id: 6,
    brand: 'Target',
    difficulty: 'easy',
    effect: 'pixelate',
    effectValue: 16,
    options: ['Target', 'Walmart', 'Macy’s', 'Costco'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF"/>
        <circle cx="100" cy="100" r="75" fill="#CC0000"/>
        <circle cx="100" cy="100" r="50" fill="#FFFFFF"/>
        <circle cx="100" cy="100" r="25" fill="#CC0000"/>
      </svg>
    `,
  },
  {
    id: 7,
    brand: 'Netflix',
    difficulty: 'easy',
    effect: 'partial-reveal',
    effectValue: 35,
    options: ['Netflix', 'Hulu', 'HBO Max', 'Disney+'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#000000"/>
        <path d="M60 40 L85 40 L85 160 L60 160 Z" fill="#B81D24"/>
        <path d="M115 40 L140 40 L140 160 L115 160 Z" fill="#B81D24"/>
        <path d="M60 40 L140 160 L115 160 L60 50 Z" fill="#E50914"/>
      </svg>
    `,
  },
  {
    id: 8,
    brand: 'Instagram',
    difficulty: 'easy',
    effect: 'blur',
    effectValue: 12,
    options: ['Instagram', 'TikTok', 'Snapchat', 'Pinterest'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="ig-g-easy" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFD600"/>
            <stop offset="25%" stop-color="#FF7A00"/>
            <stop offset="50%" stop-color="#FF0069"/>
            <stop offset="75%" stop-color="#D300C5"/>
            <stop offset="100%" stop-color="#7638FA"/>
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="46" fill="url(#ig-g-easy)"/>
        <rect x="45" y="45" width="110" height="110" rx="32" stroke="#FFFFFF" stroke-width="12" fill="none"/>
        <circle cx="100" cy="100" r="28" stroke="#FFFFFF" stroke-width="12" fill="none"/>
        <circle cx="134" cy="66" r="6" fill="#FFFFFF"/>
      </svg>
    `,
  },
  {
    id: 9,
    brand: 'Pepsi',
    difficulty: 'easy',
    effect: 'pixelate',
    effectValue: 16,
    options: ['Pepsi', 'Coca-Cola', 'Red Bull', 'Fanta'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <circle cx="100" cy="100" r="68" fill="#FFFFFF"/>
        <path d="M36 84 C 54 84, 82 120, 164 100 A 68 68 0 0 0 36 84 Z" fill="#DA291C"/>
        <path d="M36 116 C 54 116, 90 74, 164 100 A 68 68 0 0 1 36 116 Z" fill="#005CB9"/>
      </svg>
    `,
  },
  {
    id: 10,
    brand: 'Amazon',
    difficulty: 'easy',
    effect: 'partial-reveal',
    effectValue: 30,
    options: ['Amazon', 'eBay', 'Alibaba', 'Shopify'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#131921"/>
        <text x="50" y="105" font-family="'Outfit', sans-serif" font-weight="800" font-size="64" fill="#FFFFFF">a</text>
        <path d="M48 128 C 75 152, 125 152, 155 124" stroke="#FF9900" stroke-width="8" stroke-linecap="round" fill="none"/>
        <polygon points="152,116 162,126 146,132" fill="#FF9900"/>
      </svg>
    `,
  },
  {
    id: 11,
    brand: 'YouTube',
    difficulty: 'easy',
    effect: 'blur',
    effectValue: 12,
    options: ['YouTube', 'Vimeo', 'Twitch', 'Dailymotion'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <rect x="36" y="55" width="128" height="90" rx="28" fill="#FF0000"/>
        <polygon points="88,78 126,100 88,122" fill="#FFFFFF"/>
      </svg>
    `,
  },
  {
    id: 12,
    brand: 'Google',
    difficulty: 'easy',
    effect: 'pixelate',
    effectValue: 18,
    options: ['Google', 'Chrome', 'Firefox', 'Opera'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF"/>
        <path d="M100 68 C118 68 132 75 142 85 L165 62 C148 46 126 36 100 36 C62 36 30 58 15 90 L42 111 C49 91 73 68 100 68 Z" fill="#EA4335"/>
        <path d="M165 62 L142 85 C150 93 156 104 156 116 C156 124 154 130 150 136 L100 136 L100 102 L164 102 C165 106 166 111 166 116 C166 153 140 180 100 180 C62 180 30 158 15 126 L42 105 C49 125 73 148 100 148 C118 148 133 142 143 133 L165 155" fill="#4285F4"/>
        <path d="M15 90 C11 100 11 112 15 122 L42 101 C41 97 41 93 42 89 L15 68 Z" fill="#FBBC05"/>
        <path d="M15 122 L42 101 C49 121 73 144 100 144 C117 144 132 138 143 129 L165 151 C148 167 126 176 100 176 C62 176 30 154 15 122 Z" fill="#34A853"/>
      </svg>
    `,
  },

  // ===================== MEDIUM (12 Brands) =====================
  {
    id: 13,
    brand: 'Mercedes-Benz',
    difficulty: 'medium',
    effect: 'grayscale',
    effectValue: 100,
    options: ['Mercedes-Benz', 'BMW', 'Volkswagen', 'Porsche'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0B0F19"/>
        <circle cx="100" cy="100" r="70" stroke="#CBD5E1" stroke-width="10" fill="none"/>
        <path d="M100 100 L100 35 M100 100 L44 135 M100 100 L156 135" stroke="#CBD5E1" stroke-width="10" stroke-linecap="round"/>
        <polygon points="100,35 93,95 100,100" fill="#94A3B8"/>
        <polygon points="100,35 107,95 100,100" fill="#E2E8F0"/>
        <polygon points="44,135 96,104 100,100" fill="#94A3B8"/>
        <polygon points="44,135 98,111 100,100" fill="#E2E8F0"/>
        <polygon points="156,135 104,104 100,100" fill="#E2E8F0"/>
        <polygon points="156,135 102,111 100,100" fill="#94A3B8"/>
      </svg>
    `,
  },
  {
    id: 14,
    brand: 'Mastercard',
    difficulty: 'medium',
    effect: 'grayscale',
    effectValue: 100,
    options: ['Mastercard', 'Visa', 'American Express', 'Discover'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#18181B"/>
        <circle cx="78" cy="100" r="48" fill="#EB001B"/>
        <circle cx="122" cy="100" r="48" fill="#F79E1B" fill-opacity="0.88"/>
      </svg>
    `,
  },
  {
    id: 15,
    brand: 'Tesla',
    difficulty: 'medium',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Tesla', 'Lucid', 'Rivian', 'Polestar'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#F8FAFC"/>
        <path d="M100 50 C125 50 148 57 165 67 L160 80 C145 72 124 66 100 66 C76 66 55 72 40 80 L35 67 C52 57 75 50 100 50 Z" fill="#E82127"/>
        <path d="M93 84 L107 84 L107 145 C107 148 104 158 100 162 C96 158 93 148 93 145 Z" fill="#E82127"/>
        <path d="M60 84 C72 87 84 94 90 102 L86 112 C80 105 72 100 60 97 Z" fill="#E82127"/>
        <path d="M140 84 C128 87 116 94 110 102 L114 112 C120 105 128 100 140 97 Z" fill="#E82127"/>
      </svg>
    `,
  },
  {
    id: 16,
    brand: 'Audi',
    difficulty: 'medium',
    effect: 'mask',
    effectValue: 4,
    options: ['Audi', 'Olympic Games', 'Subaru', 'Toyota'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0B0F19"/>
        <circle cx="55" cy="100" r="25" stroke="#E2E8F0" stroke-width="7" fill="none"/>
        <circle cx="85" cy="100" r="25" stroke="#E2E8F0" stroke-width="7" fill="none"/>
        <circle cx="115" cy="100" r="25" stroke="#E2E8F0" stroke-width="7" fill="none"/>
        <circle cx="145" cy="100" r="25" stroke="#E2E8F0" stroke-width="7" fill="none"/>
      </svg>
    `,
  },
  {
    id: 17,
    brand: 'Microsoft',
    difficulty: 'medium',
    effect: 'pixelate',
    effectValue: 16,
    options: ['Microsoft', 'Windows', 'Intel', 'IBM'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0B0F19"/>
        <rect x="48" y="48" width="48" height="48" fill="#F25022"/>
        <rect x="104" y="48" width="48" height="48" fill="#7FBA00"/>
        <rect x="48" y="104" width="48" height="48" fill="#00A4EF"/>
        <rect x="104" y="104" width="48" height="48" fill="#FFB900"/>
      </svg>
    `,
  },
  {
    id: 18,
    brand: 'Puma',
    difficulty: 'medium',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Puma', 'Jaguar', 'Slazenger', 'Reebok'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#F8FAFC"/>
        <path d="M155 75 C146 64 134 68 122 75 C108 83 95 95 80 98 C65 101 48 94 38 108 C32 116 38 126 46 122 C56 117 68 116 78 122 C88 128 92 139 96 150 C98 155 106 152 106 145 C106 133 112 121 122 114 C134 105 152 108 162 96 C168 89 164 83 155 75 Z" fill="#0F172A"/>
      </svg>
    `,
  },
  {
    id: 19,
    brand: 'Twitter (X)',
    difficulty: 'medium',
    effect: 'blur',
    effectValue: 12,
    options: ['Twitter (X)', 'Threads', 'Bluesky', 'Mastodon'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#000000"/>
        <path d="M142 45 L110 93 L155 155 L138 155 L101 106 L66 155 L45 155 L79 104 L36 45 L53 45 L88 92 L121 45 Z" fill="#FFFFFF"/>
      </svg>
    `,
  },
  {
    id: 20,
    brand: 'Starbucks',
    difficulty: 'medium',
    effect: 'mask',
    effectValue: 6,
    options: ['Starbucks', 'Costa Coffee', "Dunkin'", "Peet's"],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#006241"/>
        <circle cx="100" cy="100" r="70" stroke="#FFFFFF" stroke-width="8" fill="none"/>
        <circle cx="100" cy="100" r="48" fill="#FFFFFF"/>
        <polygon points="100,68 106,82 120,82 109,91 113,105 100,96 87,105 91,91 80,82 94,82" fill="#006241"/>
        <circle cx="100" cy="115" r="14" fill="#006241"/>
      </svg>
    `,
  },
  {
    id: 21,
    brand: 'BMW',
    difficulty: 'medium',
    effect: 'grayscale',
    effectValue: 100,
    options: ['BMW', 'Mercedes-Benz', 'Volvo', 'Ford'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <circle cx="100" cy="100" r="70" stroke="#CBD5E1" stroke-width="8" fill="#000000"/>
        <circle cx="100" cy="100" r="48" fill="#FFFFFF"/>
        <path d="M100 52 A48 48 0 0 1 148 100 L100 100 Z" fill="#0066B1"/>
        <path d="M100 100 L100 148 A48 48 0 0 1 52 100 Z" fill="#0066B1"/>
      </svg>
    `,
  },
  {
    id: 22,
    brand: 'Burger King',
    difficulty: 'medium',
    effect: 'mask',
    effectValue: 4,
    options: ['Burger King', "McDonald's", "Wendy's", 'Subway'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#F4E8D1"/>
        <circle cx="100" cy="100" r="72" stroke="#005A9C" stroke-width="12" fill="#F4E8D1"/>
        <path d="M48 95 C 48 65, 152 65, 152 95 Z" fill="#ED7902"/>
        <path d="M52 108 C 52 135, 148 135, 148 108 Z" fill="#ED7902"/>
        <rect x="42" y="96" width="116" height="12" rx="6" fill="#D62300"/>
      </svg>
    `,
  },
  {
    id: 23,
    brand: 'Intel',
    difficulty: 'medium',
    effect: 'blur',
    effectValue: 12,
    options: ['Intel', 'AMD', 'Nvidia', 'Qualcomm'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0071C5"/>
        <circle cx="68" cy="74" r="8" fill="#FFFFFF"/>
        <path d="M40 100 C 40 60, 160 60, 160 100 C 160 140, 40 140, 40 100" stroke="#FFFFFF" stroke-width="8" fill="none"/>
        <text x="75" y="112" font-family="'Outfit', sans-serif" font-weight="900" font-size="34" fill="#FFFFFF">intel</text>
      </svg>
    `,
  },
  {
    id: 24,
    brand: 'PlayStation',
    difficulty: 'medium',
    effect: 'partial-reveal',
    effectValue: 35,
    options: ['PlayStation', 'Xbox', 'Nintendo', 'Sega'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#003791"/>
        <path d="M85 45 L85 145 C85 155 75 155 75 145 L75 80 C75 60 95 60 95 80" stroke="#FF0000" stroke-width="12" stroke-linecap="round" fill="none"/>
        <path d="M60 140 C85 125 145 125 155 140 C145 155 85 155 60 140 Z" fill="#00F0FF"/>
      </svg>
    `,
  },

  // ===================== HARD (12 Brands) =====================
  {
    id: 25,
    brand: 'Ferrari',
    difficulty: 'hard',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Ferrari', 'Lamborghini', 'Porsche', 'Maserati'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFF200"/>
        <path d="M60 30 L140 30 L140 120 C140 155 100 175 100 175 C100 175 60 155 60 120 Z" fill="#FFF200" stroke="#000" stroke-width="5"/>
        <rect x="60" y="30" width="80" height="8" fill="#008D46"/>
        <rect x="60" y="38" width="80" height="8" fill="#FFFFFF"/>
        <rect x="60" y="46" width="80" height="8" fill="#D40000"/>
        <path d="M108 65 C105 60 97 62 95 68 C92 74 95 80 97 85 C92 88 84 94 86 102 C88 110 93 113 90 125 C88 132 82 140 85 146 C87 149 93 147 95 140 C98 130 99 120 102 112 C106 112 112 122 116 135 C118 142 121 146 124 142 C126 137 122 127 117 118 C122 115 125 107 123 98 C120 86 112 80 110 72 Z" fill="#000000"/>
      </svg>
    `,
  },
  {
    id: 26,
    brand: 'Chanel',
    difficulty: 'hard',
    effect: 'mask',
    effectValue: 6,
    options: ['Chanel', 'Gucci', 'Prada', 'Versace'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF"/>
        <path d="M85 75 C70 75 60 85 60 100 C60 115 70 125 85 125 C98 125 106 117 108 108" stroke="#000000" stroke-width="14" stroke-linecap="round" fill="none"/>
        <path d="M115 75 C130 75 140 85 140 100 C140 115 130 125 115 125 C102 125 94 117 92 108" stroke="#000000" stroke-width="14" stroke-linecap="round" fill="none"/>
      </svg>
    `,
  },
  {
    id: 27,
    brand: 'Disney',
    difficulty: 'hard',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Disney', 'Pixar', 'DreamWorks', 'Warner Bros.'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#F8FAFC"/>
        <path d="M35 150 C40 100 80 60 165 80" stroke="#0284C7" stroke-width="8" stroke-linecap="round" fill="none"/>
        <polygon points="90,140 90,105 100,85 110,105 110,140" fill="#0284C7"/>
        <polygon points="70,140 70,118 78,102 86,118 86,140" fill="#0284C7"/>
        <polygon points="114,140 114,118 122,102 130,118 130,140" fill="#0284C7"/>
        <path d="M96 140 A8 8 0 0 1 104 140 Z" fill="#F8FAFC"/>
      </svg>
    `,
  },
  {
    id: 28,
    brand: 'Rolex',
    difficulty: 'hard',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Rolex', 'Omega', 'Tag Heuer', 'Cartier'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#006039"/>
        <!-- 5-pointed crown -->
        <circle cx="50" cy="70" r="7" fill="#A37E2C"/>
        <circle cx="75" cy="55" r="7" fill="#A37E2C"/>
        <circle cx="100" cy="45" r="7" fill="#A37E2C"/>
        <circle cx="125" cy="55" r="7" fill="#A37E2C"/>
        <circle cx="150" cy="70" r="7" fill="#A37E2C"/>
        <polygon points="50,75 75,130 125,130 150,75 125,95 100,50 75,95" fill="#A37E2C"/>
        <rect x="65" y="136" width="70" height="10" rx="4" fill="#A37E2C"/>
      </svg>
    `,
  },
  {
    id: 29,
    brand: 'Lamborghini',
    difficulty: 'hard',
    effect: 'mask',
    effectValue: 6,
    options: ['Lamborghini', 'Ferrari', 'Porsche', 'Aston Martin'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0B0F19"/>
        <polygon points="100,30 160,50 148,150 100,175 52,150 40,50" fill="#000000" stroke="#D4AF37" stroke-width="6"/>
        <!-- Raging bull gold silhouette -->
        <path d="M75 110 C80 90 95 85 115 90 C125 80 135 95 125 110 C130 125 110 135 90 125 Z" fill="#D4AF37"/>
        <polygon points="120,85 135,70 125,90" fill="#D4AF37"/>
      </svg>
    `,
  },
  {
    id: 30,
    brand: 'Red Bull',
    difficulty: 'hard',
    effect: 'partial-reveal',
    effectValue: 35,
    options: ['Red Bull', 'Monster Energy', 'Rockstar', 'Gatorade'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#001489"/>
        <circle cx="100" cy="100" r="45" fill="#FFD100"/>
        <!-- Dual charging bulls -->
        <path d="M45 105 C60 85 85 90 92 105 C85 115 65 120 45 105 Z" fill="#DA291C"/>
        <path d="M155 105 C140 85 115 90 108 105 C115 115 135 120 155 105 Z" fill="#DA291C"/>
      </svg>
    `,
  },
  {
    id: 31,
    brand: 'Lacoste',
    difficulty: 'hard',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Lacoste', 'Polo Ralph Lauren', 'Tommy Hilfiger', 'Fred Perry'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#FFFFFF"/>
        <!-- Crocodile shape -->
        <path d="M45 100 C50 85 70 85 85 95 C110 88 140 92 155 80 C150 105 135 115 115 112 C95 120 70 118 45 100 Z" fill="#005A36"/>
        <polygon points="150,85 160,82 155,90" fill="#E31B23"/>
      </svg>
    `,
  },
  {
    id: 32,
    brand: 'Lego',
    difficulty: 'hard',
    effect: 'mask',
    effectValue: 6,
    options: ['Lego', 'Playmobil', 'Mattel', 'Hasbro'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#D11013"/>
        <rect x="35" y="35" width="130" height="130" rx="20" fill="#FFD500"/>
        <rect x="42" y="42" width="116" height="116" rx="16" fill="#000000"/>
        <text x="52" y="118" font-family="'Outfit', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF">LEGO</text>
      </svg>
    `,
  },
  {
    id: 33,
    brand: 'Gucci',
    difficulty: 'hard',
    effect: 'partial-reveal',
    effectValue: 35,
    options: ['Gucci', 'Chanel', 'Louis Vuitton', 'Prada'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <!-- Interlocking Gs -->
        <path d="M85 65 C60 65 50 85 50 100 C50 115 60 135 85 135 C105 135 110 120 110 110 L85 110" stroke="#E2E8F0" stroke-width="12" fill="none" stroke-linecap="round"/>
        <path d="M115 135 C140 135 150 115 150 100 C150 85 140 65 115 65 C95 65 90 80 90 90 L115 90" stroke="#E2E8F0" stroke-width="12" fill="none" stroke-linecap="round"/>
      </svg>
    `,
  },
  {
    id: 34,
    brand: 'Marvel',
    difficulty: 'hard',
    effect: 'blur',
    effectValue: 14,
    options: ['Marvel', 'DC Comics', 'Dark Horse', 'Image Comics'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#EC1D24"/>
        <text x="30" y="118" font-family="'Outfit', sans-serif" font-weight="900" font-size="38" letter-spacing="-2" fill="#FFFFFF">MARVEL</text>
      </svg>
    `,
  },
  {
    id: 35,
    brand: 'Starbucks Siren',
    difficulty: 'hard',
    effect: 'silhouette',
    effectValue: 1,
    options: ['Starbucks', 'Costa Coffee', 'Caribou', 'Tim Hortons'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#006241"/>
        <circle cx="100" cy="100" r="68" stroke="#FFFFFF" stroke-width="8" fill="none"/>
        <polygon points="100,55 106,72 122,72 109,83 114,99 100,89 86,99 91,83 78,72 94,72" fill="#FFFFFF"/>
        <circle cx="100" cy="115" r="14" fill="#FFFFFF"/>
      </svg>
    `,
  },
  {
    id: 36,
    brand: 'Domino’s',
    difficulty: 'hard',
    effect: 'pixelate',
    effectValue: 16,
    options: ['Domino’s', 'Pizza Hut', 'Papa John’s', 'Little Caesars'],
    svg: `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="200" height="200" rx="30" fill="#0F172A"/>
        <g transform="rotate(45 100 100)">
          <rect x="65" y="50" width="70" height="45" rx="8" fill="#E31837"/>
          <circle cx="100" cy="72" r="8" fill="#FFFFFF"/>
          <rect x="65" y="105" width="70" height="45" rx="8" fill="#006491"/>
          <circle cx="85" cy="127" r="8" fill="#FFFFFF"/>
          <circle cx="115" cy="127" r="8" fill="#FFFFFF"/>
        </g>
      </svg>
    `,
  },
];
