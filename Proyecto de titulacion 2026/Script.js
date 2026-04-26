// ===== CONFIGURACIÓN DE FIREBASE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// CORREGIDO: Eliminada importación duplicada y incorrecta de initializeApp y getAnalytics
const firebaseConfig = {
  apiKey: "AIzaSyB8I6rvxjkUjd-j5-yC62SNAqfpqnQ4fmM",
  authDomain: "world-travel-c3f55.firebaseapp.com",
  projectId: "world-travel-c3f55",
  storageBucket: "world-travel-c3f55.firebasestorage.app",
  messagingSenderId: "369060802601",
  appId: "1:369060802601:web:96a694ef3d8c1296776c38",
  measurementId: "G-3FQEKFZSYE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== DATOS DE DESTINOS CON IMÁGENES LOCALES (46 DESTINOS) =====
const destinations = [
    {
        id: 1,
        name: "París, Francia",
        image: "Paris.jpg",
        location: "Francia",
        description: "La ciudad del amor te espera con sus monumentos icónicos y gastronomía excepcional. Disfruta de la Torre Eiffel, el Louvre y los encantadores barrios parisinos.",
        price: "850",
        oldPrice: "950",
        rating: 4.8,
        duration: "5 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "gastronomia", "romantico"]
    },
    {
        id: 2,
        name: "Tokio, Japón",
        image: "Tokio.jpg",
        location: "Japón",
        description: "Donde la tradición se encuentra con la innovación en cada esquina de esta metrópolis. Desde los templos antiguos hasta el bullicioso cruce de Shibuya.",
        price: "1200",
        oldPrice: "1400",
        rating: 4.9,
        duration: "7 días",
        type: "aventura",
        tags: ["ciudad", "aventura", "cultura", "tecnologia"]
    },
    {
        id: 3,
        name: "Nueva York, USA",
        image: "NewYork.jpg",
        location: "Estados Unidos",
        description: "La ciudad que nunca duerme, llena de energía y posibilidades infinitas. Times Square, Central Park y Broadway te esperan.",
        price: "950",
        oldPrice: "1100",
        rating: 4.7,
        duration: "6 días",
        type: "cultural",
        tags: ["ciudad", "shopping", "cultura", "entretenimiento"]
    },
    {
        id: 4,
        name: "Bali, Indonesia",
        image: "Bali.jpg",
        location: "Indonesia",
        description: "Playas paradisíacas, templos ancestrales y una cultura fascinante te esperan. El destino perfecto para relajarse y conectar con la naturaleza.",
        price: "1100",
        oldPrice: "1300",
        rating: 4.9,
        duration: "8 días",
        type: "playa",
        tags: ["playa", "relax", "aventura", "naturaleza"]
    },
    {
        id: 5,
        name: "Roma, Italia",
        image: "Roma.jpg",
        location: "Italia",
        description: "Sumérgete en la historia del Imperio Romano y disfruta de la auténtica cocina italiana. El Coliseo, el Vaticano y la fontana de Trevi te esperan.",
        price: "900",
        rating: 4.6,
        duration: "5 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "gastronomia", "historia"]
    },
    {
        id: 6,
        name: "Santorini, Grecia",
        image: "Santorini.jpg",
        location: "Grecia",
        description: "Atardeceres inolvidables y arquitectura blanca en esta joya del Mediterráneo. Perfecto para lunas de miel y viajes románticos.",
        price: "1300",
        oldPrice: "1500",
        rating: 4.8,
        duration: "6 días",
        type: "playa",
        tags: ["playa", "relax", "romantico"]
    },
    {
        id: 7,
        name: "Cancún, México",
        image: "Cancun.jpg",
        location: "México",
        description: "Aguas turquesas, playas de arena blanca y ruinas mayas. El paraíso caribeño con todo incluido para unas vacaciones perfectas.",
        price: "1100",
        oldPrice: "1250",
        rating: 4.7,
        duration: "7 días",
        type: "playa",
        tags: ["playa", "aventura", "relax", "cultura"]
    },
    {
        id: 8,
        name: "Alpes Suizos, Suiza",
        image: "AlpesSuizos.jpg",
        location: "Suiza",
        description: "Montañas imponentes, lagos cristalinos y pueblos de cuento. Ideal para amantes de la naturaleza y los deportes de invierno.",
        price: "1400",
        rating: 4.9,
        duration: "6 días",
        type: "montaña",
        tags: ["montaña", "aventura", "naturaleza"]
    },
    {
        id: 9,
        name: "Bangkok, Tailandia",
        image: "Bangkok.jpg",
        location: "Tailandia",
        description: "Templos dorados, mercados flotantes y una exquisita gastronomía en la vibrante capital tailandesa.",
        price: "850",
        oldPrice: "950",
        rating: 4.5,
        duration: "6 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "gastronomia", "aventura"]
    },
    {
        id: 10,
        name: "Dubái, Emiratos Árabes",
        image: "Dubai.jpg",
        location: "Emiratos Árabes",
        description: "Rascacielos futuristas, desierto dorado y lujo sin límites en esta ciudad del Golfo Pérsico.",
        price: "1500",
        oldPrice: "1800",
        rating: 4.8,
        duration: "6 días",
        type: "aventura",
        tags: ["ciudad", "aventura", "lujo", "shopping"]
    },
    {
        id: 11,
        name: "Sídney, Australia",
        image: "Sidney.jpg",
        location: "Australia",
        description: "La famosa Ópera de Sídney, playas espectaculares y una mezcla única de naturaleza y urbanismo.",
        price: "1800",
        rating: 4.9,
        duration: "8 días",
        type: "playa",
        tags: ["ciudad", "playa", "naturaleza"]
    },
    {
        id: 12,
        name: "Río de Janeiro, Brasil",
        image: "RioDeJaneiro.jpg",
        location: "Brasil",
        description: "El Cristo Redentor, las playas de Copacabana e Ipanema, y el carnaval más famoso del mundo.",
        price: "1100",
        rating: 4.7,
        duration: "7 días",
        type: "playa",
        tags: ["playa", "cultura", "aventura"]
    },
    {
        id: 13,
        name: "Praga, República Checa",
        image: "Praga.jpg",
        location: "República Checa",
        description: "La ciudad de las cien torres, con un casco histórico medieval perfectamente conservado.",
        price: "850",
        rating: 4.6,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "romantico"]
    },
    {
        id: 14,
        name: "Kioto, Japón",
        image: "Kioto.jpg",
        location: "Japón",
        description: "Templos antiguos, jardines zen y geishas en la capital cultural de Japón.",
        price: "1300",
        rating: 4.9,
        duration: "6 días",
        type: "cultural",
        tags: ["cultura", "historia", "relax", "naturaleza"]
    },
    {
        id: 15,
        name: "Marrakech, Marruecos",
        image: "Marrakech.jpg",
        location: "Marruecos",
        description: "Mercados coloridos, palacios majestuosos y la magia del desierto marroquí.",
        price: "900",
        oldPrice: "1100",
        rating: 4.5,
        duration: "5 días",
        type: "cultural",
        tags: ["cultura", "aventura", "gastronomia"]
    },
    {
        id: 16,
        name: "Maldivas",
        image: "Maldivas.jpg",
        location: "Maldivas",
        description: "Islas paradisíacas con aguas turquesas y bungalows sobre el mar. El destino perfecto para luna de miel.",
        price: "2500",
        oldPrice: "3000",
        rating: 4.9,
        duration: "8 días",
        type: "playa",
        tags: ["playa", "lujo", "relax", "romantico"]
    },
    {
        id: 17,
        name: "Londres, Reino Unido",
        image: "Londres.jpg",
        location: "Reino Unido",
        description: "La vibrante capital británica combina historia y modernidad. El Big Ben, London Eye y los museos más famosos del mundo.",
        price: "980",
        oldPrice: "1150",
        rating: 4.7,
        duration: "5 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "shopping"]
    },
    {
        id: 18,
        name: "Cusco, Perú",
        image: "Cusco.jpg",
        location: "Perú",
        description: "Puerta de entrada a Machu Picchu, con su arquitectura incaica y colonial. Una experiencia única en los Andes.",
        price: "750",
        oldPrice: "900",
        rating: 4.8,
        duration: "6 días",
        type: "aventura",
        tags: ["aventura", "cultura", "historia", "montaña"]
    },
    {
        id: 19,
        name: "Lisboa, Portugal",
        image: "Lisboa.jpg",
        location: "Portugal",
        description: "Colinas empinadas, tranvías amarillos y el nostálgico fado. Una ciudad encantadora con excelente gastronomía.",
        price: "650",
        rating: 4.6,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "gastronomia", "relax"]
    },
    {
        id: 20,
        name: "Phuket, Tailandia",
        image: "Phuket.jpg",
        location: "Tailandia",
        description: "Playas de ensueño, vida nocturna vibrante y templos budistas. El paraíso tailandés por excelencia.",
        price: "950",
        oldPrice: "1100",
        rating: 4.7,
        duration: "7 días",
        type: "playa",
        tags: ["playa", "aventura", "relax", "gastronomia"]
    },
    {
        id: 21,
        name: "Bariloche, Argentina",
        image: "Bariloche.jpg",
        location: "Argentina",
        description: "Lagos cristalinos, montañas y el mejor chocolate. Ideal para aventura y relax en la Patagonia argentina.",
        price: "800",
        rating: 4.7,
        duration: "6 días",
        type: "montaña",
        tags: ["montaña", "aventura", "naturaleza", "relax"]
    },
    {
        id: 22,
        name: "Estambul, Turquía",
        image: "Estambul.jpg",
        location: "Turquía",
        description: "Donde oriente se encuentra con occidente. Mezquitas, bazares y la deliciosa gastronomía turca.",
        price: "720",
        oldPrice: "850",
        rating: 4.6,
        duration: "5 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "gastronomia"]
    },
    {
        id: 23,
        name: "Islandia",
        image: "Islandia.jpg",
        location: "Islandia",
        description: "Auroras boreales, géiseres, cascadas y paisajes volcánicos. La tierra del hielo y el fuego te espera.",
        price: "1600",
        rating: 4.9,
        duration: "7 días",
        type: "aventura",
        tags: ["aventura", "naturaleza", "montaña", "relax"]
    },
    {
        id: 24,
        name: "Cartagena, Colombia",
        image: "Cartagena.jpg",
        location: "Colombia",
        description: "Ciudad amurallada con playas caribeñas, coloridas casas coloniales y una vibrante cultura.",
        price: "780",
        oldPrice: "920",
        rating: 4.7,
        duration: "5 días",
        type: "playa",
        tags: ["playa", "cultura", "historia", "relax"]
    },
    {
        id: 25,
        name: "Viena, Austria",
        image: "Viena.jpg",
        location: "Austria",
        description: "La capital de la música clásica, con palacios imperiales, cafés históricos y el encanto europeo.",
        price: "890",
        rating: 4.7,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "romantico"]
    },
    {
        id: 26,
        name: "Costa Rica",
        image: "CostaRica.jpg",
        location: "Costa Rica",
        description: "Biodiversidad pura: selvas, volcanes, playas de ambos océanos y el famoso 'Pura Vida'.",
        price: "1200",
        oldPrice: "1400",
        rating: 4.9,
        duration: "8 días",
        type: "aventura",
        tags: ["aventura", "naturaleza", "playa", "relax"]
    },
    {
        id: 27,
        name: "Seúl, Corea del Sur",
        image: "Seul.jpg",
        location: "Corea del Sur",
        description: "Tecnología de punta, palacios antiguos, K-Pop y una gastronomía que conquista el mundo.",
        price: "1150",
        rating: 4.8,
        duration: "6 días",
        type: "aventura",
        tags: ["ciudad", "tecnologia", "cultura", "gastronomia"]
    },
    {
        id: 28,
        name: "Fiordos Noruegos",
        image: "FiordosNoruegos.jpg",
        location: "Noruega",
        description: "Paisajes impresionantes de fiordos, montañas y cascadas. Un paraíso para los amantes de la naturaleza.",
        price: "1850",
        rating: 4.9,
        duration: "7 días",
        type: "montaña",
        tags: ["montaña", "naturaleza", "aventura", "relax"]
    },
    {
        id: 29,
        name: "Miami, USA",
        image: "Miami.jpg",
        location: "Estados Unidos",
        description: "Playas de ensueño, Art Deco, vida nocturna y el vibrante ambiente latino de Little Havana.",
        price: "1050",
        oldPrice: "1250",
        rating: 4.6,
        duration: "5 días",
        type: "playa",
        tags: ["playa", "ciudad", "shopping", "entretenimiento"]
    },
    {
        id: 30,
        name: "Budapest, Hungría",
        image: "Budapest.jpg",
        location: "Hungría",
        description: "La perla del Danubio, con sus baños termales, el Parlamento y el encanto de Europa del Este.",
        price: "620",
        rating: 4.6,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "relax"]
    },
    {
        id: 31,
        name: "Cabo Verde",
        image: "CaboVerde.jpg",
        location: "Cabo Verde",
        description: "Islas volcánicas en el Atlántico, playas vírgenes y la cultura criolla más auténtica.",
        price: "1100",
        oldPrice: "1300",
        rating: 4.7,
        duration: "7 días",
        type: "playa",
        tags: ["playa", "relax", "aventura", "naturaleza"]
    },
    {
        id: 32,
        name: "Amsterdam, Países Bajos",
        image: "Amsterdam.jpg",
        location: "Países Bajos",
        description: "Canales románticos, museos de clase mundial, bicicletas y tulipanes en la ciudad más liberal de Europa.",
        price: "780",
        rating: 4.7,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "relax"]
    },
    {
        id: 33,
        name: "Mauricio",
        image: "Mauricio.jpg",
        location: "Mauricio",
        description: "Paraíso tropical en el Índico con playas de ensueño, arrecifes de coral y una mezcla cultural única.",
        price: "1650",
        oldPrice: "1900",
        rating: 4.8,
        duration: "8 días",
        type: "playa",
        tags: ["playa", "lujo", "relax", "romantico"]
    },
    {
        id: 34,
        name: "Toronto, Canadá",
        image: "Toronto.jpg",
        location: "Canadá",
        description: "La CN Tower, diversidad cultural y la espectacular cascada del Niágara a solo una hora.",
        price: "1100",
        rating: 4.6,
        duration: "5 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "aventura", "naturaleza"]
    },
    {
        id: 35,
        name: "Hawai, USA",
        image: "Hawai.jpg",
        location: "Estados Unidos",
        description: "Volcanes activos, olas perfectas para surf, luaus hawaianos y la magia del Pacífico.",
        price: "1900",
        oldPrice: "2200",
        rating: 4.9,
        duration: "8 días",
        type: "playa",
        tags: ["playa", "aventura", "naturaleza", "relax"]
    },
    {
        id: 36,
        name: "Dublín, Irlanda",
        image: "Dublin.jpg",
        location: "Irlanda",
        description: "Pubs tradicionales, literatura, castillos centenarios y la calidez de la gente irlandesa.",
        price: "700",
        rating: 4.5,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "gastronomia"]
    },
    {
        id: 37,
        name: "San Petersburgo, Rusia",
        image: "SanPetersburgo.jpg",
        location: "Rusia",
        description: "El Hermitage, canales, palacios imperiales y las noches blancas en la capital cultural rusa.",
        price: "950",
        oldPrice: "1100",
        rating: 4.7,
        duration: "6 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "historia", "arte"]
    },
    {
        id: 38,
        name: "Seychelles",
        image: "Seychelles.jpg",
        location: "Seychelles",
        description: "Granito gigante, playas de arena rosada y aguas cristalinas en este archipiélago de ensueño.",
        price: "2200",
        oldPrice: "2600",
        rating: 4.9,
        duration: "8 días",
        type: "playa",
        tags: ["playa", "lujo", "relax", "romantico"]
    },
    {
        id: 39,
        name: "Florencia, Italia",
        image: "Florencia.jpg",
        location: "Italia",
        description: "Cuna del Renacimiento, con el David de Miguel Ángel, la catedral y la mejor pasta de Italia.",
        price: "880",
        rating: 4.8,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "arte", "gastronomia"]
    },
    {
        id: 40,
        name: "Krabi, Tailandia",
        image: "Krabi.jpg",
        location: "Tailandia",
        description: "Acantilados de piedra caliza, aguas esmeralda y playas vírgenes en el sur tailandés.",
        price: "820",
        oldPrice: "980",
        rating: 4.8,
        duration: "6 días",
        type: "playa",
        tags: ["playa", "aventura", "naturaleza", "relax"]
    },
    {
        id: 41,
        name: "Patagonia, Chile/Argentina",
        image: "Patagonia.jpg",
        location: "Chile/Argentina",
        description: "Glaciares, Torres del Paine, el Fitz Roy y los paisajes más salvajes del mundo.",
        price: "1700",
        rating: 4.9,
        duration: "10 días",
        type: "montaña",
        tags: ["montaña", "aventura", "naturaleza", "trekking"]
    },
    {
        id: 42,
        name: "Brujas, Bélgica",
        image: "Brujas.jpg",
        location: "Bélgica",
        description: "La Venecia del Norte, con sus canales medievales, chocolate belga y arquitectura de cuento.",
        price: "580",
        rating: 4.6,
        duration: "3 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "romantico", "relax"]
    },
    {
        id: 43,
        name: "Zanzíbar, Tanzania",
        image: "Zanzibar.jpg",
        location: "Tanzania",
        description: "Aguas turquesas, cultura swahili y las famosas puertas talladas de Stone Town.",
        price: "1400",
        oldPrice: "1650",
        rating: 4.7,
        duration: "7 días",
        type: "playa",
        tags: ["playa", "cultura", "aventura", "relax"]
    },
    {
        id: 44,
        name: "Copenhague, Dinamarca",
        image: "Copenhague.jpg",
        location: "Dinamarca",
        description: "La Sirenita, Nyhavn colorido, bicicletas y la mejor gastronomía nórdica del mundo.",
        price: "980",
        rating: 4.7,
        duration: "4 días",
        type: "cultural",
        tags: ["ciudad", "cultura", "gastronomia", "relax"]
    },
    {
        id: 45,
        name: "Machu Picchu, Perú",
        image: "MachuPicchu.jpg",
        location: "Perú",
        description: "La ciudadela inca en los Andes, una de las 7 maravillas del mundo moderno.",
        price: "1250",
        oldPrice: "1500",
        rating: 4.9,
        duration: "5 días",
        type: "aventura",
        tags: ["aventura", "cultura", "historia", "montaña"]
    },
    {
        id: 46,
        name: "Islas Galápagos, Ecuador",
        image: "IslasGalapagos.jpg",
        location: "Ecuador",
        description: "Fauna única en el mundo: tortugas gigantes, iguanas marinas y paisajes volcánicos.",
        price: "2100",
        rating: 4.9,
        duration: "8 días",
        type: "aventura",
        tags: ["aventura", "naturaleza", "playa", "relax"]
    }
];

const exchangeRates = {
    EUR: { USD: 1.08, GBP: 0.86, JPY: 161.5 },
    USD: { EUR: 0.93, GBP: 0.79, JPY: 149.5 },
    GBP: { EUR: 1.16, USD: 1.26, JPY: 187.5 },
    JPY: { EUR: 0.0062, USD: 0.0067, GBP: 0.0053 }
};

// ===== VARIABLES GLOBALES =====
let currentTestimonial = 0;
let wishlist = [];
let currentLanguage = 'es';
let currentStep = 1;
let currentPage = 1;
let itemsPerPage = 12;
let allDestinations = [...destinations];
let filteredDestinations = [...destinations];
let currentPopularIndex = 0;
let popularInterval;
let currentUser = null;

// ===== FUNCIONES DE FIRESTORE PARA WISHLIST =====
async function loadWishlistFromFirebase() {
    if (!currentUser) {
        wishlist = [];
        return;
    }
    
    try {
        const wishlistRef = collection(db, "wishlists");
        const q = query(wishlistRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        wishlist = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.destinationIds) {
                wishlist = data.destinationIds;
            }
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateAllWishlistButtons();
    } catch (error) {
        console.error("Error loading wishlist:", error);
        wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    }
}

async function saveWishlistToFirebase() {
    if (!currentUser) return;
    
    try {
        const wishlistRef = collection(db, "wishlists");
        const q = query(wishlistRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const docRef = doc(db, "wishlists", querySnapshot.docs[0].id);
            await setDoc(docRef, {
                userId: currentUser.uid,
                destinationIds: wishlist,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } else {
            await addDoc(collection(db, "wishlists"), {
                userId: currentUser.uid,
                destinationIds: wishlist,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error("Error saving wishlist:", error);
    }
}

function updateAllWishlistButtons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = parseInt(btn.dataset.destination);
        if (wishlist.includes(id)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ===== FUNCIONES DE FIRESTORE PARA TRIP PLANS =====
async function loadTripPlansFromFirebase() {
    if (!currentUser) return [];
    
    try {
        const plansRef = collection(db, "tripPlans");
        const q = query(plansRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const plans = [];
        querySnapshot.forEach((doc) => {
            plans.push({ id: doc.id, ...doc.data() });
        });
        
        return plans;
    } catch (error) {
        console.error("Error loading trip plans:", error);
        return JSON.parse(localStorage.getItem('tripPlans')) || [];
    }
}

async function saveTripPlanToFirebase(tripPlan) {
    if (!currentUser) {
        let savedPlans = JSON.parse(localStorage.getItem('tripPlans') || '[]');
        savedPlans.push({ ...tripPlan, localId: Date.now() });
        localStorage.setItem('tripPlans', JSON.stringify(savedPlans));
        return;
    }
    
    try {
        await addDoc(collection(db, "tripPlans"), {
            userId: currentUser.uid,
            ...tripPlan,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error saving trip plan:", error);
    }
}

async function deleteTripPlanFromFirebase(planId) {
    if (!currentUser) {
        let savedPlans = JSON.parse(localStorage.getItem('tripPlans') || '[]');
        savedPlans = savedPlans.filter(plan => plan.localId !== planId && plan.id !== planId);
        localStorage.setItem('tripPlans', JSON.stringify(savedPlans));
        return;
    }
    
    try {
        await deleteDoc(doc(db, "tripPlans", planId));
    } catch (error) {
        console.error("Error deleting trip plan:", error);
    }
}

async function getUserTripPlans() {
    if (!currentUser) {
        return JSON.parse(localStorage.getItem('tripPlans') || '[]');
    }
    return await loadTripPlansFromFirebase();
}

// ===== FUNCIONES GLOBALES PARA ONCLICK =====
window.toggleWishlist = async function(id) {
    const index = wishlist.indexOf(id);
    if (index === -1) {
        wishlist.push(id);
        showToast('success', 'Añadido a favoritos', 'Destino guardado en tu lista');
    } else {
        wishlist.splice(index, 1);
        showToast('info', 'Eliminado de favoritos', 'Destino removido de tu lista');
    }
    
    await saveWishlistToFirebase();
    
    const btn = document.querySelector(`.wishlist-btn[data-destination="${id}"]`);
    if (btn) btn.classList.toggle('active');
    
    const grid = document.getElementById('destinationsGrid');
    if (grid && grid.children.length > 0) {
        loadInitialDestinations();
    }
};

window.viewDestinationDetails = function(id) {
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;
    
    const existingModal = document.getElementById('destinationModal');
    if (existingModal) existingModal.remove();
    
    const modalHtml = `
        <div class="modal-overlay" id="destinationModal" style="display:flex;">
            <div class="modal-container" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>${dest.name}</h3>
                    <button class="modal-close" onclick="window.closeModal('destinationModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <h4>Descripción</h4>
                    <p>${dest.description}</p>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                        <div style="background: var(--gray-100); padding: 1rem; border-radius: var(--radius);">
                            <strong>Ubicación:</strong><br>${dest.location}
                        </div>
                        <div style="background: var(--gray-100); padding: 1rem; border-radius: var(--radius);">
                            <strong>Duración:</strong><br>${dest.duration}
                        </div>
                        <div style="background: var(--gray-100); padding: 1rem; border-radius: var(--radius);">
                            <strong>Precio:</strong><br>€${dest.price}
                        </div>
                        <div style="background: var(--gray-100); padding: 1rem; border-radius: var(--radius);">
                            <strong>Calificación:</strong><br>${dest.rating}/5
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="window.bookDestination(${dest.id})">
                            <i class="fas fa-shopping-cart"></i> Reservar Ahora
                        </button>
                        <button class="btn btn-secondary" onclick="window.toggleWishlist(${dest.id}); window.closeModal('destinationModal')">
                            <i class="fas fa-heart"></i> Añadir a Favoritos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.body.style.overflow = 'hidden';
    
    const modal = document.getElementById('destinationModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closeModal('destinationModal');
        }
    });
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
};

window.bookDestination = function(id) {
    showLoader();
    setTimeout(() => {
        hideLoader();
        const dest = destinations.find(d => d.id === id);
        showToast('success', '¡Reserva Confirmada!', `Tu reserva para ${dest?.name || 'el destino'} ha sido confirmada. Revisa tu email.`);
        window.closeModal('destinationModal');
    }, 1500);
};

// ===== FUNCIONES DE UTILIDAD =====
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        // Crear contenedor si no existe
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(newContainer);
        return showToast(type, title, message, duration);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }
    
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
}

function getStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== DESTINOS POPULARES CARRUSEL =====
function initPopularDestinationsSlider() {
    const track = document.getElementById('popularTrack');
    if (!track) return;
    
    track.innerHTML = '';
    const popularDestinations = destinations.slice(0, 10);
    
    popularDestinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'popular-card';
        card.onclick = () => window.viewDestinationDetails(dest.id);
        card.innerHTML = `
            <img src="${dest.image}" alt="${dest.name}" loading="lazy">
            <div class="popular-card-info">
                <h4>${dest.name}</h4>
                <p>Desde €${dest.price}</p>
            </div>
        `;
        track.appendChild(card);
    });
    
    const prevBtn = document.querySelector('.prev-popular');
    const nextBtn = document.querySelector('.next-popular');
    
    if (prevBtn) prevBtn.addEventListener('click', () => slidePopular(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => slidePopular(1));
    
    adjustPopularTrack();
    window.addEventListener('resize', adjustPopularTrack);
    
    startPopularAutoSlide();
}

function adjustPopularTrack() {
    const track = document.getElementById('popularTrack');
    if (!track) return;
    track.style.transform = `translateX(-${currentPopularIndex * getCardWidth()}px)`;
}

function getCardWidth() {
    const card = document.querySelector('.popular-card');
    if (!card) return 216;
    return card.offsetWidth + 16;
}

function slidePopular(direction) {
    const track = document.getElementById('popularTrack');
    const cards = document.querySelectorAll('.popular-card');
    if (!cards.length) return;
    
    const cardWidth = getCardWidth();
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, cards.length - visibleCards);
    
    currentPopularIndex += direction;
    currentPopularIndex = Math.max(0, Math.min(currentPopularIndex, maxIndex));
    
    if (track) {
        track.style.transform = `translateX(-${currentPopularIndex * cardWidth}px)`;
    }
}

function getVisibleCards() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 5;
}

function startPopularAutoSlide() {
    if (popularInterval) clearInterval(popularInterval);
    popularInterval = setInterval(() => {
        const cards = document.querySelectorAll('.popular-card');
        const maxIndex = Math.max(0, cards.length - getVisibleCards());
        if (currentPopularIndex >= maxIndex) {
            currentPopularIndex = 0;
            adjustPopularTrack();
        } else {
            slidePopular(1);
        }
    }, 5000);
}

// ===== CREAR TARJETA DE DESTINO =====
function createDestinationCard(destination) {
    const starRating = getStarRating(destination.rating);
    const isInWishlist = wishlist.includes(destination.id);
    
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.innerHTML = `
        <div class="destination-image">
            <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            <span class="destination-tag">${destination.type}</span>
            <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" 
                    data-destination="${destination.id}"
                    onclick="window.toggleWishlist(${destination.id})">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="destination-content">
            <h3 class="destination-title">${destination.name}</h3>
            <div class="destination-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${destination.location}</span>
            </div>
            <p class="destination-description">${destination.description.substring(0, 100)}...</p>
            ${destination.oldPrice ? `
                <div class="price-comparison">
                    <span class="price-old">€${destination.oldPrice}</span>
                    <span class="destination-price">€${destination.price}</span>
                </div>
            ` : `<div class="destination-price">Desde €${destination.price}</div>`}
            <div class="destination-meta">
                <div class="destination-rating">
                    ${starRating}
                    <span>${destination.rating}</span>
                </div>
                <div class="destination-duration">
                    <i class="far fa-clock"></i>
                    ${destination.duration}
                </div>
            </div>
            <button class="btn-card" onclick="window.viewDestinationDetails(${destination.id})">
                <i class="fas fa-eye"></i> Ver Detalles
            </button>
        </div>
    `;
    return card;
}

function loadInitialDestinations() {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    destinations.slice(0, 12).forEach(dest => {
        grid.appendChild(createDestinationCard(dest));
    });
}

// ===== AUTENTICACIÓN DE USUARIOS CON FIREBASE =====
function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const authModalTitle = document.getElementById('authModalTitle');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                signOut(auth).then(async () => {
                    showToast('info', 'Sesión cerrada', 'Has cerrado sesión correctamente');
                    wishlist = [];
                    updateAllWishlistButtons();
                }).catch(error => {
                    showToast('error', 'Error', error.message);
                });
            } else {
                if (authModal) {
                    authModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }

    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            if (authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginFormContainer) loginFormContainer.style.display = 'none';
            if (registerFormContainer) registerFormContainer.style.display = 'block';
            if (authModalTitle) authModalTitle.textContent = 'Registrarse';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerFormContainer) registerFormContainer.style.display = 'none';
            if (loginFormContainer) loginFormContainer.style.display = 'block';
            if (authModalTitle) authModalTitle.textContent = 'Iniciar Sesión';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showToast('error', 'Error', 'Por favor completa todos los campos');
                return;
            }
            
            showLoader();
            try {
                await signInWithEmailAndPassword(auth, email, password);
                showToast('success', 'Bienvenido', 'Has iniciado sesión correctamente');
                if (authModal) {
                    authModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                loginForm.reset();
            } catch (error) {
                let errorMessage = 'Error al iniciar sesión';
                if (error.code === 'auth/user-not-found') errorMessage = 'Usuario no encontrado';
                if (error.code === 'auth/wrong-password') errorMessage = 'Contraseña incorrecta';
                if (error.code === 'auth/invalid-email') errorMessage = 'Email inválido';
                if (error.code === 'auth/too-many-requests') errorMessage = 'Demasiados intentos. Intenta más tarde';
                showToast('error', 'Error', errorMessage);
            } finally {
                hideLoader();
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (!name || !email || !password) {
                showToast('error', 'Error', 'Por favor completa todos los campos');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('error', 'Error', 'Las contraseñas no coinciden');
                return;
            }
            
            if (password.length < 6) {
                showToast('error', 'Error', 'La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            showLoader();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: name
                });
                
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: name,
                    email: email,
                    createdAt: serverTimestamp(),
                    role: "user"
                });
                
                showToast('success', 'Registro exitoso', `Bienvenido ${name}`);
                if (authModal) {
                    authModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                registerForm.reset();
            } catch (error) {
                let errorMessage = 'Error al registrarse';
                if (error.code === 'auth/email-already-in-use') errorMessage = 'Este email ya está registrado';
                if (error.code === 'auth/invalid-email') errorMessage = 'Email inválido';
                if (error.code === 'auth/weak-password') errorMessage = 'Contraseña demasiado débil';
                if (error.code === 'auth/operation-not-allowed') errorMessage = 'Registro no habilitado';
                showToast('error', 'Error', errorMessage);
            } finally {
                hideLoader();
            }
        });
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        const loginBtnText = document.getElementById('loginBtnText');
        
        if (user) {
            const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario');
            if (loginBtnText) loginBtnText.textContent = `Hola, ${displayName}`;
            
            await loadWishlistFromFirebase();
            
            updateAllWishlistButtons();
            // CORREGIDO: Verificar que updatePlansCounter existe antes de llamarlo
            if (typeof updatePlansCounter === 'function') updatePlansCounter();
        } else {
            if (loginBtnText) loginBtnText.textContent = 'Iniciar Sesión';
            wishlist = [];
            updateAllWishlistButtons();
        }
    });
}

// ===== FORMULARIO DE CONTACTO CON FIREBASE =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!contactForm) return;
    if (successMessage) successMessage.style.display = 'none';

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const newsletter = document.querySelector('input[name="newsletter"]')?.checked || false;

        if (!name || !email || !subject || !message) {
            showToast('error', 'Error', 'Por favor completa todos los campos obligatorios');
            return;
        }
        
        if (!validateEmail(email)) {
            showToast('error', 'Error', 'Por favor introduce un email válido');
            return;
        }

        showLoader();
        
        try {
            await addDoc(collection(db, "contactos"), {
                nombre: name,
                email: email,
                telefono: phone || '',
                asunto: subject,
                mensaje: message,
                newsletter: newsletter,
                userId: currentUser?.uid || null,
                fecha: serverTimestamp()
            });
            
            showToast('success', '¡Mensaje enviado!', 'Te contactaremos pronto.');
            contactForm.reset();
            
            if (successMessage) {
                successMessage.style.display = 'flex';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            showToast('error', 'Error', 'No se pudo enviar el mensaje. Intenta de nuevo.');
        } finally {
            hideLoader();
        }
    });

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            
            if (!validateEmail(email)) {
                showToast('error', 'Error', 'Por favor, introduce un email válido');
                return;
            }
            
            showLoader();
            try {
                await addDoc(collection(db, "suscripciones"), {
                    email: email,
                    userId: currentUser?.uid || null,
                    fecha: serverTimestamp()
                });
                showToast('success', '¡Suscripción exitosa!', 'Te hemos enviado un email de confirmación.');
                newsletterForm.reset();
            } catch (error) {
                showToast('error', 'Error', 'No se pudo procesar la suscripción');
            } finally {
                hideLoader();
            }
        });
    }
}

// ===== TESTIMONIOS SLIDER =====
function initTestimonialSlider() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (!testimonials.length) return;
    
    function showTestimonial(index) {
        testimonials.forEach(t => t.style.display = 'none');
        dots.forEach(d => d.classList.remove('active'));
        testimonials[index].style.display = 'block';
        dots[index].classList.add('active');
        currentTestimonial = index;
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showTestimonial((currentTestimonial + 1) % testimonials.length);
        });
    }
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => showTestimonial(i));
    });
    
    setInterval(() => {
        showTestimonial((currentTestimonial + 1) % testimonials.length);
    }, 5000);
}

// ===== CONTADORES =====
function initStatsCounter() {
    animateCounter(document.getElementById('destinationsCount'), 0, destinations.length, 2000);
    animateCounter(document.getElementById('travelersCount'), 0, 50000, 2000);
    animateCounter(document.getElementById('satisfactionCount'), 0, 98, 2000);
}

function animateCounter(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + (element.id === 'satisfactionCount' ? '%' : '+');
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ===== NAVEGACIÓN =====
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') 
                    ? 'fas fa-times' 
                    : 'fas fa-bars';
            }
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle?.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
            }
        });
    });
}

// ===== FILTROS =====
function initFilters() {
    const showFiltersBtn = document.getElementById('showFilters');
    const closeFiltersBtn = document.getElementById('closeFilters');
    const filtersPanel = document.getElementById('filtersPanel');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const ratingRange = document.getElementById('ratingRange');
    const ratingValue = document.getElementById('ratingValue');
    const applyFiltersBtn = document.getElementById('applyFilters');

    if (showFiltersBtn) {
        showFiltersBtn.addEventListener('click', () => {
            if (filtersPanel) filtersPanel.classList.toggle('show');
        });
    }
    
    if (closeFiltersBtn && filtersPanel) {
        closeFiltersBtn.addEventListener('click', () => {
            filtersPanel.classList.remove('show');
        });
    }
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = '€' + priceRange.value;
        });
    }
    
    if (ratingRange && ratingValue) {
        ratingRange.addEventListener('input', () => {
            ratingValue.textContent = ratingRange.value + '★';
        });
    }
    
    const typeTags = document.querySelectorAll('#typeTags .filter-tag');
    typeTags.forEach(tag => {
        tag.addEventListener('click', () => {
            typeTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const maxPrice = parseInt(priceRange?.value || 5000);
            const minRating = parseFloat(ratingRange?.value || 3.5);
            const selectedType = document.querySelector('#typeTags .filter-tag.active')?.dataset.type || 'all';
            
            const filtered = destinations.filter(dest => {
                const price = parseInt(dest.price);
                if (price > maxPrice) return false;
                if (dest.rating < minRating) return false;
                if (selectedType !== 'all' && dest.type !== selectedType) return false;
                return true;
            });
            
            if (filtered.length > 0) {
                showToast('success', 'Filtros aplicados', `Encontrados ${filtered.length} destinos`);
                loadFilteredDestinations(filtered);
                if (filtersPanel) filtersPanel.classList.remove('show');
            } else {
                showToast('warning', 'Sin resultados', 'No se encontraron destinos con esos filtros');
            }
        });
    }
}

function loadFilteredDestinations(filtered) {
    const grid = document.getElementById('destinationsGrid');
    if (grid) {
        grid.innerHTML = '';
        filtered.forEach(dest => {
            grid.appendChild(createDestinationCard(dest));
        });
    }
}

// ===== BÚSQUEDA =====
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) {
                showToast('warning', 'Búsqueda', 'Por favor, introduce un destino para buscar');
                return;
            }
            
            const filtered = destinations.filter(d => 
                d.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (filtered.length > 0) {
                showToast('success', 'Resultados', `Encontramos ${filtered.length} destino(s) para "${searchTerm}"`);
                loadFilteredDestinations(filtered);
            } else {
                showToast('warning', 'Sin resultados', `No encontramos destinos para "${searchTerm}"`);
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// ===== CONVERSOR DE MONEDA =====
function initCurrencyConverter() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    const swapBtn = document.getElementById('swapCurrencies');
    
    function convert() {
        const from = fromCurrency?.value;
        const to = toCurrency?.value;
        const amount = parseFloat(fromAmount?.value || 0);
        
        if (!from || !to || !toAmount) return;
        
        if (from === to) {
            toAmount.value = amount.toFixed(2);
            return;
        }
        
        const rate = exchangeRates[from]?.[to];
        if (rate) {
            toAmount.value = (amount * rate).toFixed(2);
        }
    }
    
    if (fromCurrency) fromCurrency.addEventListener('change', convert);
    if (toCurrency) toCurrency.addEventListener('change', convert);
    if (fromAmount) fromAmount.addEventListener('input', convert);
    
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            if (fromCurrency && toCurrency) {
                const temp = fromCurrency.value;
                fromCurrency.value = toCurrency.value;
                toCurrency.value = temp;
                convert();
            }
        });
    }
    
    convert();
}

// ===== TRIP PLANNER COMPLETAMENTE FUNCIONAL CON FIREBASE =====
function initTripPlanner() {
    const nextStepBtn = document.getElementById('nextStep');
    const prevStepBtn = document.getElementById('prevStep');
    const steps = document.querySelectorAll('.planner-step');
    
    let tripData = {
        destination: '',
        checkin: '',
        checkout: '',
        travelers: 2,
        accommodation: 'hotel',
        activities: [],
        budget: 2000
    };
    
    function updateUI() {
        document.querySelectorAll('.planner-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        document.querySelectorAll('.planner-content').forEach(content => {
            const contentStep = parseInt(content.dataset.step);
            if (contentStep === currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        if (prevStepBtn) {
            prevStepBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
        }
        
        if (nextStepBtn) {
            nextStepBtn.innerHTML = currentStep === 4 ? 
                '<i class="fas fa-check"></i> Completar' : 
                'Siguiente <i class="fas fa-arrow-right"></i>';
        }
        
        if (currentStep === 4) updateSummary();
        if (currentStep === 3) updateRecommendations();
    }
    
    function updateRecommendations() {
        const recommendationsDiv = document.getElementById('recommendations');
        if (!recommendationsDiv) return;
        
        const destination = tripData.destination;
        const dest = destinations.find(d => d.id == destination);
        
        if (!dest) {
            recommendationsDiv.innerHTML = '<p style="color: var(--gray-600);">Selecciona un destino para ver recomendaciones</p>';
            return;
        }
        
        const recommendations = [];
        
        if (dest.type === 'playa') {
            recommendations.push('🏖️ Lleva protector solar, traje de baño y sandalias');
            recommendations.push('🐠 Reserva un tour de snorkel o buceo');
            recommendations.push('🌅 No te pierdas el atardecer en la playa');
        } else if (dest.type === 'montaña') {
            recommendations.push('🥾 Ropa de abrigo y calzado adecuado para trekking');
            recommendations.push('📷 Lleva cámara para los paisajes impresionantes');
            recommendations.push('🧴 Protector solar de alta protección');
        } else if (dest.type === 'cultural') {
            recommendations.push('🏛️ Compra entradas anticipadas para museos populares');
            recommendations.push('📚 Investiga un poco sobre la historia del lugar');
            recommendations.push('👟 Calzado cómodo para caminar mucho');
        } else if (dest.type === 'aventura') {
            recommendations.push('🎒 Equipo adecuado para actividades extremas');
            recommendations.push('💪 Prepárate físicamente para la aventura');
            recommendations.push('📋 Contrata seguros de aventura');
        }
        
        recommendations.push('💳 Lleva efectivo y tarjeta internacional');
        recommendations.push('🌍 Descarga maps offline o compra eSIM local');
        
        recommendationsDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, var(--primary-light), var(--primary-dark)); padding: 1.5rem; border-radius: var(--radius); color: white;">
                <h5 style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-lightbulb"></i> Recomendaciones para ${dest.name}
                </h5>
                <ul style="margin: 0; padding-left: 1.2rem;">
                    ${recommendations.map(rec => `<li style="margin-bottom: 0.5rem;">${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    function updateSummary() {
        const summaryDiv = document.getElementById('plannerSummary');
        if (!summaryDiv) return;
        
        const dest = destinations.find(d => d.id == tripData.destination);
        const checkinDate = tripData.checkin ? new Date(tripData.checkin).toLocaleDateString('es-ES') : 'No seleccionada';
        const checkoutDate = tripData.checkout ? new Date(tripData.checkout).toLocaleDateString('es-ES') : 'No seleccionada';
        
        let nights = 0;
        if (tripData.checkin && tripData.checkout) {
            const checkin = new Date(tripData.checkin);
            const checkout = new Date(tripData.checkout);
            nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        }
        
        let estimatedPrice = 0;
        if (dest) {
            const basePrice = parseInt(dest.price);
            estimatedPrice = basePrice * tripData.travelers;
            if (tripData.accommodation === 'luxury') estimatedPrice *= 1.5;
            if (tripData.accommodation === 'budget') estimatedPrice *= 0.7;
        }
        
        const activityNames = {
            'gastronomia': '🍜 Gastronomía',
            'aventura': '🧗 Aventura',
            'cultura': '🏛️ Cultura',
            'relax': '🧘 Relax',
            'naturaleza': '🌿 Naturaleza'
        };
        
        const activitiesList = tripData.activities.map(a => activityNames[a] || a).join(', ');
        
        summaryDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, var(--gray-100), white); padding: 1.5rem; border-radius: var(--radius);">
                <h5 style="margin-bottom: 1rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-suitcase-rolling"></i> Resumen de tu Viaje
                </h5>
                
                <div style="display: grid; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--gray-300); padding-bottom: 0.5rem;">
                        <strong><i class="fas fa-map-marker-alt"></i> Destino:</strong>
                        <span>${dest?.name || 'No seleccionado'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--gray-300); padding-bottom: 0.5rem;">
                        <strong><i class="fas fa-calendar"></i> Fechas:</strong>
                        <span>${checkinDate} → ${checkoutDate} ${nights > 0 ? `(${nights} noches)` : ''}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--gray-300); padding-bottom: 0.5rem;">
                        <strong><i class="fas fa-users"></i> Viajeros:</strong>
                        <span>${tripData.travelers} ${tripData.travelers === 1 ? 'persona' : 'personas'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--gray-300); padding-bottom: 0.5rem;">
                        <strong><i class="fas fa-hotel"></i> Alojamiento:</strong>
                        <span>${tripData.accommodation === 'hotel' ? '🏨 Hotel' : tripData.accommodation === 'luxury' ? '👑 Lujo' : '💰 Económico'}</span>
                    </div>
                    ${activitiesList ? `
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--gray-300); padding-bottom: 0.5rem;">
                        <strong><i class="fas fa-tree"></i> Actividades:</strong>
                        <span>${activitiesList}</span>
                    </div>
                    ` : ''}
                    <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; font-size: 1.1rem;">
                        <strong><i class="fas fa-euro-sign"></i> Presupuesto estimado:</strong>
                        <span style="color: var(--primary); font-weight: bold;">€${estimatedPrice.toLocaleString()}</span>
                    </div>
                </div>
                
                <div style="margin-top: 1.5rem; padding: 1rem; background: var(--primary-light); border-radius: var(--radius); text-align: center;">
                    <i class="fas fa-check-circle" style="color: var(--primary);"></i>
                    <small style="display: block; margin-top: 0.5rem;">¿Todo listo? Haz clic en "Completar" para guardar tu plan de viaje</small>
                </div>
            </div>
        `;
    }
    
    function validateStep(step) {
        if (step === 1) {
            const destination = document.getElementById('plannerDestination')?.value;
            if (!destination) {
                showToast('error', 'Error', 'Por favor selecciona un destino');
                return false;
            }
            tripData.destination = parseInt(destination);
        }
        
        if (step === 2) {
            const checkin = document.getElementById('plannerCheckin')?.value;
            const checkout = document.getElementById('plannerCheckout')?.value;
            
            if (!checkin || !checkout) {
                showToast('error', 'Error', 'Por favor selecciona ambas fechas');
                return false;
            }
            
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (checkinDate < today) {
                showToast('error', 'Error', 'La fecha de inicio no puede ser anterior a hoy');
                return false;
            }
            
            if (checkoutDate <= checkinDate) {
                showToast('error', 'Error', 'La fecha de salida debe ser posterior a la de llegada');
                return false;
            }
            
            tripData.checkin = checkin;
            tripData.checkout = checkout;
            
            const travelers = parseInt(document.getElementById('plannerTravelers')?.value || 2);
            tripData.travelers = travelers;
        }
        
        if (step === 3) {
            const accommodation = document.querySelector('input[name="accommodation"]:checked')?.value;
            if (accommodation) tripData.accommodation = accommodation;
        }
        
        return true;
    }
    
    async function saveTripPlan() {
        const dest = destinations.find(d => d.id == tripData.destination);
        const checkinDate = tripData.checkin ? new Date(tripData.checkin).toLocaleDateString('es-ES') : 'Fecha no seleccionada';
        const checkoutDate = tripData.checkout ? new Date(tripData.checkout).toLocaleDateString('es-ES') : 'Fecha no seleccionada';
        
        const tripPlan = {
            destination: dest?.name || 'Destino no especificado',
            destinationId: tripData.destination,
            checkin: tripData.checkin,
            checkout: tripData.checkout,
            checkinFormatted: checkinDate,
            checkoutFormatted: checkoutDate,
            travelers: tripData.travelers,
            accommodation: tripData.accommodation,
            activities: tripData.activities,
            budget: tripData.budget,
            createdAt: new Date().toISOString()
        };
        
        await saveTripPlanToFirebase(tripPlan);
        
        showToast('success', '¡Viaje Planificado!', 
            `Tu viaje a ${dest?.name || 'tu destino'} ha sido planificado exitosamente.`);
        
        const planner = document.getElementById('tripPlanner');
        if (planner) planner.classList.remove('show');
        resetPlanner();
        updatePlansCounter();
    }
    
    function resetPlanner() {
        currentStep = 1;
        tripData = {
            destination: '',
            checkin: '',
            checkout: '',
            travelers: 2,
            accommodation: 'hotel',
            activities: [],
            budget: 2000
        };
        
        const destSelect = document.getElementById('plannerDestination');
        if (destSelect) destSelect.value = '';
        
        const checkin = document.getElementById('plannerCheckin');
        const checkout = document.getElementById('plannerCheckout');
        if (checkin) checkin.value = '';
        if (checkout) checkout.value = '';
        
        const travelers = document.getElementById('plannerTravelers');
        if (travelers) travelers.value = '2';
        
        document.querySelectorAll('input[name="accommodation"]').forEach(radio => {
            radio.checked = radio.value === 'hotel';
        });
        
        document.querySelectorAll('#activityTags .filter-tag').forEach(tag => {
            tag.classList.remove('active');
        });
        tripData.activities = [];
        
        updateUI();
    }
    
    async function updatePlansCounter() {
        const plans = await getUserTripPlans();
        const plannerBadge = document.getElementById('plannerBadge');
        if (plannerBadge && plans.length > 0) {
            plannerBadge.style.display = 'flex';
            plannerBadge.textContent = plans.length;
        } else if (plannerBadge) {
            plannerBadge.style.display = 'none';
        }
    }
    
    window.showMyTrips = async function() {
        const savedPlans = await getUserTripPlans();
        
        if (savedPlans.length === 0) {
            showToast('info', 'Mis Viajes', 'No tienes viajes planificados aún. ¡Comienza a planificar!');
            return;
        }
        
        let tripsModal = document.getElementById('tripsModal');
        if (tripsModal) tripsModal.remove();
        
        const tripsHtml = `
            <div class="modal-overlay" id="tripsModal" style="display:flex;">
                <div class="modal-container" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3><i class="fas fa-suitcase"></i> Mis Viajes Planificados</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${savedPlans.map((plan) => `
                            <div style="background: var(--gray-100); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: start;">
                                    <div>
                                        <h4 style="color: var(--primary); margin-bottom: 0.5rem;">✈️ ${plan.destination}</h4>
                                        <div style="font-size: 0.9rem;">
                                            <div><i class="fas fa-calendar"></i> ${plan.checkinFormatted || plan.checkin} → ${plan.checkoutFormatted || plan.checkout}</div>
                                            <div><i class="fas fa-users"></i> ${plan.travelers} viajeros</div>
                                            <div><i class="fas fa-hotel"></i> ${plan.accommodation === 'hotel' ? 'Hotel' : plan.accommodation === 'luxury' ? 'Lujo' : 'Económico'}</div>
                                        </div>
                                    </div>
                                    <button class="btn-sm" onclick="window.deleteTripPlan('${plan.id || plan.localId}')" style="background: #ef4444; color: white; padding: 0.3rem 0.6rem;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', tripsHtml);
        document.body.style.overflow = 'hidden';
        
        const modal = document.getElementById('tripsModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    };
    
    window.deleteTripPlan = async function(planId) {
        await deleteTripPlanFromFirebase(planId);
        showToast('success', 'Eliminado', 'Viaje eliminado de tus planes');
        
        const modal = document.getElementById('tripsModal');
        if (modal) modal.remove();
        document.body.style.overflow = 'auto';
        window.showMyTrips();
        updatePlansCounter();
    };
    
    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < 4) {
                    currentStep++;
                    updateUI();
                } else {
                    saveTripPlan();
                }
            }
        });
    }
    
    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateUI();
            }
        });
    }
    
    const activityTags = document.querySelectorAll('#activityTags .filter-tag');
    activityTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const activity = tag.dataset.activity;
            if (tripData.activities.includes(activity)) {
                tripData.activities = tripData.activities.filter(a => a !== activity);
                tag.classList.remove('active');
            } else {
                tripData.activities.push(activity);
                tag.classList.add('active');
            }
        });
    });
    
    const today = new Date().toISOString().split('T')[0];
    const plannerCheckin = document.getElementById('plannerCheckin');
    const plannerCheckout = document.getElementById('plannerCheckout');
    
    if (plannerCheckin) {
        plannerCheckin.min = today;
        plannerCheckin.addEventListener('change', () => {
            if (plannerCheckout && plannerCheckin.value) {
                plannerCheckout.min = plannerCheckin.value;
            }
        });
    }
    
    if (plannerCheckout) {
        plannerCheckout.min = today;
    }
    
    const destSelect = document.getElementById('plannerDestination');
    if (destSelect) {
        destSelect.innerHTML = '<option value="">Selecciona un destino</option>';
        destinations.forEach(dest => {
            const option = document.createElement('option');
            option.value = dest.id;
            option.textContent = `${dest.name} - Desde €${dest.price}`;
            destSelect.appendChild(option);
        });
    }
    
    updateUI();
    updatePlansCounter();
}

// ===== FAB MENU =====
function initFAB() {
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    const fabIcon = document.getElementById('fabIcon');
    
    if (fabMain && fabMenu && fabIcon) {
        fabMain.addEventListener('click', () => {
            fabMenu.classList.toggle('show');
            fabIcon.className = fabMenu.classList.contains('show') ? 'fas fa-times' : 'fas fa-plus';
        });
    }
    
    const fabCurrency = document.getElementById('fabCurrency');
    if (fabCurrency) {
        fabCurrency.addEventListener('click', () => {
            const converter = document.getElementById('currencyConverter');
            if (converter) converter.classList.toggle('show');
            if (fabMenu) fabMenu.classList.remove('show');
            if (fabIcon) fabIcon.className = 'fas fa-plus';
        });
    }
    
    const fabPlanner = document.getElementById('fabPlanner');
    if (fabPlanner) {
        fabPlanner.addEventListener('click', () => {
            const planner = document.getElementById('tripPlanner');
            if (planner) planner.classList.toggle('show');
            if (fabMenu) fabMenu.classList.remove('show');
            if (fabIcon) fabIcon.className = 'fas fa-plus';
        });
    }
    
    const fabDarkMode = document.getElementById('fabDarkMode');
    if (fabDarkMode) fabDarkMode.addEventListener('click', toggleDarkMode);
    
    const fabLanguage = document.getElementById('fabLanguage');
    if (fabLanguage) {
        fabLanguage.addEventListener('click', () => {
            const dropdown = document.getElementById('languageDropdown');
            if (dropdown) dropdown.classList.toggle('show');
            if (fabMenu) fabMenu.classList.remove('show');
            if (fabIcon) fabIcon.className = 'fas fa-plus';
        });
    }
    
    document.addEventListener('click', (e) => {
        if (fabMain && fabMenu && fabIcon) {
            if (!fabMain.contains(e.target) && !fabMenu.contains(e.target)) {
                fabMenu.classList.remove('show');
                fabIcon.className = 'fas fa-plus';
            }
        }
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateDarkModeIcon();
    showToast('info', 'Modo Oscuro', document.body.classList.contains('dark-mode') ? 'Modo oscuro activado' : 'Modo claro activado');
}

function updateDarkModeIcon() {
    const icon = document.querySelector('#fabDarkMode i');
    if (icon) {
        icon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function initDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeIcon();
}

// ===== PROGRESS BAR =====
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (progressBar && height > 0) {
            progressBar.style.width = (winScroll / height) * 100 + '%';
        }
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (backToTop) {
            backToTop.classList.toggle('show', window.pageYOffset > 300);
        }
    });
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== SELECTOR DE IDIOMA =====
function initLanguageSelector() {
    const langBtn = document.getElementById('languageBtn');
    const langDropdown = document.getElementById('languageDropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });
    }
    
    document.querySelectorAll('.language-option').forEach(opt => {
        opt.addEventListener('click', () => {
            currentLanguage = opt.dataset.lang;
            const langSpan = langBtn?.querySelector('span');
            if (langSpan) langSpan.textContent = currentLanguage.toUpperCase();
            showToast('info', 'Idioma cambiado', `Idioma cambiado a ${opt.textContent.trim()}`);
            if (langDropdown) langDropdown.classList.remove('show');
        });
    });
    
    document.addEventListener('click', () => {
        if (langDropdown) langDropdown.classList.remove('show');
    });
}

// ===== MODAL DE TODOS LOS DESTINOS =====
function initAllDestinationsModal() {
    const viewAllBtn = document.getElementById('viewAllBtn');
    const closeBtn = document.getElementById('closeAllDestinations');
    const modal = document.getElementById('allDestinationsModal');
    const applyModalFiltersBtn = document.getElementById('applyModalFilters');
    
    if (viewAllBtn && modal) {
        viewAllBtn.addEventListener('click', () => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            allDestinations = [...destinations];
            filteredDestinations = [...destinations];
            applyModalFilters();
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            currentPage = 1;
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    const modalTripType = document.getElementById('modalTripType');
    const modalPriceRange = document.getElementById('modalPriceRange');
    const modalMinRating = document.getElementById('modalMinRating');
    const modalSortBy = document.getElementById('modalSortBy');
    
    const filterElements = [modalTripType, modalPriceRange, modalMinRating, modalSortBy];
    filterElements.forEach(el => {
        if (el) el.addEventListener('change', () => applyModalFilters());
    });
    
    const modalTags = document.querySelectorAll('#modalTags .modal-filter-tag');
    modalTags.forEach(tag => {
        tag.addEventListener('click', function() {
            if (this.dataset.tag === 'todos') {
                modalTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            } else {
                const todosTag = document.querySelector('#modalTags .modal-filter-tag[data-tag="todos"]');
                if (todosTag) todosTag.classList.remove('active');
                this.classList.toggle('active');
            }
            applyModalFilters();
        });
    });
    
    if (applyModalFiltersBtn) {
        applyModalFiltersBtn.addEventListener('click', () => applyModalFilters());
    }
    
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderFilteredDestinations();
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            const total = Math.ceil(filteredDestinations.length / itemsPerPage);
            if (currentPage < total) {
                currentPage++;
                renderFilteredDestinations();
            }
        });
    }
}

function applyModalFilters() {
    const tripType = document.getElementById('modalTripType')?.value;
    const priceRange = document.getElementById('modalPriceRange')?.value;
    const minRating = parseFloat(document.getElementById('modalMinRating')?.value || 0);
    const sortBy = document.getElementById('modalSortBy')?.value;
    const selectedTags = Array.from(document.querySelectorAll('#modalTags .modal-filter-tag.active'))
        .map(t => t.dataset.tag)
        .filter(t => t !== 'todos');
    
    filteredDestinations = allDestinations.filter(dest => {
        if (tripType && dest.type !== tripType) return false;
        if (dest.rating < minRating) return false;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            const price = parseInt(dest.price);
            if (price < min || price > max) return false;
        }
        if (selectedTags.length > 0 && !selectedTags.some(tag => dest.tags.includes(tag))) return false;
        return true;
    });
    
    if (sortBy === 'precio-asc') {
        filteredDestinations.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (sortBy === 'precio-desc') {
        filteredDestinations.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    } else if (sortBy === 'rating-desc') {
        filteredDestinations.sort((a, b) => b.rating - a.rating);
    }
    
    const resultsCount = document.getElementById('modalResultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${filteredDestinations.length} destinos encontrados`;
    }
    
    currentPage = 1;
    renderFilteredDestinations();
}

function renderFilteredDestinations() {
    const container = document.getElementById('allDestinationsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const current = filteredDestinations.slice(start, end);
    
    current.forEach(dest => {
        container.appendChild(createDestinationCard(dest));
    });
    
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const numbersDiv = document.getElementById('paginationNumbers');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    if (!numbersDiv) return;
    numbersDiv.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
        const num = document.createElement('div');
        num.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
        num.textContent = i;
        num.addEventListener('click', () => {
            currentPage = i;
            renderFilteredDestinations();
        });
        numbersDiv.appendChild(num);
    }
}

// ===== MODAL BACK TO TOP =====
function initModalBackToTop() {
    const modal = document.getElementById('allDestinationsModal');
    const modalBackToTop = document.getElementById('modalBackToTop');
    
    if (!modal || !modalBackToTop) return;
    
    modal.addEventListener('scroll', () => {
        modalBackToTop.classList.toggle('show', modal.scrollTop > 300);
    });
    
    modalBackToTop.addEventListener('click', () => {
        modal.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== ANIMACIONES AL SCROLL =====
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.destination-card, .service-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('WorldTravel App iniciada con Firebase');
    
    initNavigation();
    initTestimonialSlider();
    initContactForm();
    initStatsCounter();
    loadInitialDestinations();
    initPopularDestinationsSlider();
    initFAB();
    initDarkMode();
    initProgressBar();
    initBackToTop();
    initFilters();
    initSearch();
    initCurrencyConverter();
    initTripPlanner();
    initLanguageSelector();
    initAllDestinationsModal();
    initModalBackToTop();
    initAuth();
    addScrollAnimations();
});