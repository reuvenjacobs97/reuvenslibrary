"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { storage } from "../lib/storage";
import { Search, Lock, Unlock, Bell, X, Check, Ban, BookOpen, Settings, Mail } from "lucide-react";

// ---------- Seed data (from the owner's existing spreadsheet) ----------
const SEED_BOOKS = [
  ["The Wolf's Call","Ravens Blade","Anthony Ryan","Series",1,"Read","On Shelf",""],
  ["The Black Song","Ravens Blade","Anthony Ryan","Series",2,"Read","On Shelf",""],
  ["Elantris","Elantris","Brandon Sanderson","Series",1,"Read","On Shelf",""],
  ["Arcanum Unbounded","General Cosmere","Brandon Sanderson","Prequel/Novella",null,"Read","On Shelf",""],
  ["Dawnshard","General Cosmere","Brandon Sanderson","Prequel/Novella",null,"Read","On Loan","Akiva"],
  ["The Sunlit Man","General Cosmere","Brandon Sanderson","Prequel/Novella",null,"Read","On Shelf",""],
  ["Tress and the Emerald Sea","General Cosmere","Brandon Sanderson","Prequel/Novella",null,"Read","On Shelf",""],
  ["Yumi and the Midnight Painter","General Cosmere","Brandon Sanderson","Prequel/Novella",null,"Read","On Loan","Akiva"],
  ["Isles of the Emberdark","General Cosmere","Brandon Sanderson","Prequel/Novella",null,"Not Read","On Shelf",""],
  ["Mistborn","Mistborn","Brandon Sanderson","Series",1,"Read","On Shelf",""],
  ["The Well of Ascension","Mistborn","Brandon Sanderson","Series",2,"Read","On Shelf",""],
  ["The Hero of Ages","Mistborn","Brandon Sanderson","Series",3,"Read","On Shelf",""],
  ["Skyward","Skyward","Brandon Sanderson","Series",1,"Read","On Loan","yoav saada"],
  ["Starsight","Skyward","Brandon Sanderson","Series",2,"Read","On Shelf",""],
  ["Cytonic","Skyward","Brandon Sanderson","Series",3,"Read","On Shelf",""],
  ["Skyward Flight","Skyward","Brandon Sanderson","Prequel/Novella","3.5","Read","On Shelf",""],
  ["Way of Kings Part 1/2","The Storm Light Archives","Brandon Sanderson","Series",1,"Read","On Shelf",""],
  ["Way of Kings Part 2/2","The Storm Light Archives","Brandon Sanderson","Series",1,"Read","On Shelf",""],
  ["Words of Radiance Part 1/2","The Storm Light Archives","Brandon Sanderson","Series",2,"Read","On Shelf",""],
  ["Words of Radiance Part 2/2","The Storm Light Archives","Brandon Sanderson","Series",2,"Read","On Shelf",""],
  ["Oathbringer Part 1/2","The Storm Light Archives","Brandon Sanderson","Series",3,"Read","On Shelf",""],
  ["Oathbringer Part 2/2","The Storm Light Archives","Brandon Sanderson","Series",3,"Read","On Shelf",""],
  ["Rhythm of War","The Storm Light Archives","Brandon Sanderson","Series",4,"Read","On Shelf",""],
  ["Wind and Truth","The Storm Light Archives","Brandon Sanderson","Series",5,"Read","On Loan","Jake"],
  ["Warbreaker","Warbreaker","Brandon Sanderson","Series",1,"Read","On Shelf",""],
  ["The Alloy of Law","Wax & Wayne","Brandon Sanderson","Series",1,"Read","On Shelf",""],
  ["Shadows of Self","Wax & Wayne","Brandon Sanderson","Series",2,"Read","On Shelf",""],
  ["The Bands of Mourning","Wax & Wayne","Brandon Sanderson","Series",3,"Read","On Shelf",""],
  ["The Lost Metal","Wax & Wayne","Brandon Sanderson","Series",4,"Read","On Shelf",""],
  ["The Way of the Shadows","Night Angel","Brent Weeks","Series",1,"Read","On Shelf",""],
  ["Shadow's Edge","Night Angel","Brent Weeks","Series",2,"Read","On Shelf",""],
  ["Beyond The Shadows","Night Angel","Brent Weeks","Series",3,"Read","On Shelf",""],
  ["Night Angel Nemesis","The Kylar Chronicles","Brent Weeks","Series",1,"Read","On Shelf",""],
  ["Promise of Blood","The Powder Mage","Brian McClellan","Series",1,"Read","On Shelf",""],
  ["The Crimson Campaign","The Powder Mage","Brian McClellan","Series",2,"Read","On Shelf",""],
  ["The Autumn Republic","The Powder Mage","Brian McClellan","Series",3,"Read","On Shelf",""],
  ["The Blacktongue Thief","Blacktongue","Christopher Buehlman","Series",1,"Read","On Shelf",""],
  ["The Daughters War","Blacktongue","Christopher Buehlman","Prequel/Novella",null,"Read","On Shelf",""],
  ["Rhapsody","Symphony of Ages","Elizabeth Hayden","Series",1,"Read","On Shelf",""],
  ["Prophecy","Symphony of Ages","Elizabeth Hayden","Series",2,"Read","On Shelf",""],
  ["Destiny","Symphony of Ages","Elizabeth Hayden","Series",3,"Read","On Shelf",""],
  ["Elegy for a Lost Star","Symphony of Ages","Elizabeth Hayden","Series",4,"Read","On Shelf",""],
  ["The Merchant Emperor","Symphony of Ages","Elizabeth Hayden","Series",5,"Read","On Shelf",""],
  ["The Rage of Dragons","The Burning","Evan Winter","Series",1,"Read","On Shelf",""],
  ["The Fires of Vengeance","The Burning","Evan Winter","Series",2,"Read","On Shelf",""],
  ["The Will of The Many","Hierarchy","James Islington","Series",1,"Read","On Shelf",""],
  ["Furies of Calderon","Codex Alera","Jim Butcher","Series",1,"Read","On Shelf",""],
  ["Academ's Fury","Codex Alera","Jim Butcher","Series",2,"Read","On Shelf",""],
  ["Cursor's Fury","Codex Alera","Jim Butcher","Series",3,"Read","On Shelf",""],
  ["Captain's Fury","Codex Alera","Jim Butcher","Series",4,"Read","On Shelf",""],
  ["Princeps Fury","Codex Alera","Jim Butcher","Series",5,"Read","On Shelf",""],
  ["First Lord's Fury","Codex Alera","Jim Butcher","Series",6,"Read","On Shelf",""],
  ["Sasha","A Trial of Blood and Steel","Joel Shepherd","Series",1,"Read","On Shelf",""],
  ["Petrodor","A Trial of Blood and Steel","Joel Shepherd","Series",2,"Read","On Shelf",""],
  ["Tracato","A Trial of Blood and Steel","Joel Shepherd","Series",3,"Read","On Shelf",""],
  ["Haven","A Trial of Blood and Steel","Joel Shepherd","Series",4,"Read","On Shelf",""],
  ["Malice","The Faithful and The Fallen","John Gwynne","Series",1,"Read","On Shelf",""],
  ["Valour","The Faithful and The Fallen","John Gwynne","Series",2,"Read","On Shelf",""],
  ["Ruin","The Faithful and The Fallen","John Gwynne","Series",3,"Read","On Shelf",""],
  ["Wrath","The Faithful and The Fallen","John Gwynne","Series",4,"Read","On Shelf",""],
  ["The Prodigal Mage","Fisherman's Children","Karen Miller","Series",1,"Read","On Shelf",""],
  ["The Reluctant Mage","Fisherman's Children","Karen Miller","Series",2,"Read","On Shelf",""],
  ["A Blight of Mages","Kingmaker, Kingbreaker","Karen Miller","Prequel/Novella","0.5","Read","On Shelf",""],
  ["The Innocent Mage","Kingmaker, Kingbreaker","Karen Miller","Series",1,"Read","On Shelf",""],
  ["The Awakened Mage","Kingmaker, Kingbreaker","Karen Miller","Series",2,"Read","On Shelf",""],
  ["Aurora Rising","Aurora Cycle","Kaufman & Kristoff","Series",null,"Read","On Shelf",""],
  ["Beguilement","The Sharing Knife","Lois McMaster Bujold","Series",1,"Read","On Shelf",""],
  ["Legacy","The Sharing Knife","Lois McMaster Bujold","Series",2,"Read","On Shelf",""],
  ["Passage","The Sharing Knife","Lois McMaster Bujold","Series",3,"Read","On Shelf",""],
  ["Horizon","The Sharing Knife","Lois McMaster Bujold","Series",4,"Read","On Shelf",""],
  ["The Night Agent","","Mathew Quirk","Stand Alone",null,"Not Read","On Shelf",""],
  ["The Five Greatest Warriors","Jack","Mathew Reilly","Series",null,"Read","On Shelf",""],
  ["Scarecrow and the Army of Thieves","Shane","Mathew Reilly","Stand Alone",null,"Read","On Shelf",""],
  ["The Obsidian Tower","Rooks & Ruin","Melissa Caruso","Series",1,"Read","On Shelf",""],
  ["The Quicksilver Court","Rooks & Ruin","Melissa Caruso","Series",2,"Read","On Shelf",""],
  ["The Ivory Tomb","Rooks & Ruin","Melissa Caruso","Series",3,"Read","On Shelf",""],
  ["The Tethered Mage","Swords & Fire","Melissa Caruso","Series",1,"Read","On Shelf",""],
  ["The Defiant Heir","Swords & Fire","Melissa Caruso","Series",2,"Read","On Shelf",""],
  ["The Unbound Empire","Swords & Fire","Melissa Caruso","Series",3,"Read","On Shelf",""],
  ["Kings of the Wyld","The Band","Nicholas Eames","Series",1,"Read","On Shelf",""],
  ["Bloody Rose","The Band","Nicholas Eames","Series",2,"Read","On Shelf",""],
  ["Revelations","Assassins Creed","Oliver Bowden","Stand Alone",null,"Read","On Shelf",""],
  ["Name of the Wind","King Killer Chronicle","Patrick Rothfuss","Series",1,"Read","On Shelf",""],
  ["The Wise Man's Fear","King Killer Chronicle","Patrick Rothfuss","Series",2,"Read","On Shelf",""],
  ["The Slow Regard of Silent Things","King Killer Chronicle","Patrick Rothfuss","Prequel/Novella","2.5","Read","On Shelf",""],
  ["The Warded Man","The Demon Cycle","Peter V Brett","Series",1,"Read","On Shelf",""],
  ["The Desert Spear","The Demon Cycle","Peter V Brett","Series",2,"Read","On Shelf",""],
  ["The Daylight War","The Demon Cycle","Peter V Brett","Series",3,"Read","On Shelf",""],
  ["The Skull Throne","The Demon Cycle","Peter V Brett","Series",4,"Read","On Shelf",""],
  ["The Core","The Demon Cycle","Peter V Brett","Series",5,"Read","On Shelf",""],
  ["Red Rising","Red Rising","Pierce Brown","Series",1,"Not Read","On Shelf",""],
  ["The Poppy War","The Poppy War","R.F Kuang","Series",1,"Read","On Shelf",""],
  ["The Burning God","The Poppy War","R.F Kuang","Series",2,"Not Read","On Shelf",""],
  ["The Dragon Republic","The Poppy War","R.F Kuang","Series",3,"Not Read","On Shelf",""],
  ["New Spring","The Wheel of Time","Robert Jordan","Prequel/Novella","0.5","Read","On Shelf",""],
  ["The Eye of the World","The Wheel of Time","Robert Jordan","Series",1,"Read","On Shelf",""],
  ["The Great Hunt","The Wheel of Time","Robert Jordan","Series",2,"Read","On Shelf",""],
  ["Crossroads of Twilight","The Wheel of Time","Robert Jordan","Series",10,"Read","On Shelf",""],
  ["Knife of Dreams","The Wheel of Time","Robert Jordan","Series",11,"Read","On Shelf",""],
  ["The Dragon Reborn","The Wheel of Time","Robert Jordan","Series",3,"Read","On Shelf",""],
  ["The Shadow Rising","The Wheel of Time","Robert Jordan","Series",4,"Read","On Shelf",""],
  ["The Fires of Heaven","The Wheel of Time","Robert Jordan","Series",5,"Read","On Shelf",""],
  ["Lord of Chaos","The Wheel of Time","Robert Jordan","Series",6,"Read","On Shelf",""],
  ["A Crown of Swords","The Wheel of Time","Robert Jordan","Series",7,"Read","On Shelf",""],
  ["The Path of Daggers","The Wheel of Time","Robert Jordan","Series",8,"Read","On Shelf",""],
  ["Winter's Heart","The Wheel of Time","Robert Jordan","Series",9,"Read","On Shelf",""],
  ["The Gathering Storm","The Wheel of Time","Robert Jordan (Brandon Sanderson)","Series",12,"Read","On Shelf",""],
  ["Towers of Midnight","The Wheel of Time","Robert Jordan (Brandon Sanderson)","Series",13,"Read","On Shelf",""],
  ["A Memory of Light","The Wheel of Time","Robert Jordan (Brandon Sanderson)","Series",14,"Read","On Shelf",""],
  ["Assassin's Apprentice","Farseer","Robin Hobb","Series",1,"Read","On Shelf",""],
  ["The Royal Assassin","Farseer","Robin Hobb","Series",2,"Read","On Shelf",""],
  ["Assassin's Quest","Farseer","Robin Hobb","Series",3,"Read","On Shelf",""],
  ["The Mad Ship","Liveship Traders","Robin Hobb","Series",1,"Read","On Shelf",""],
  ["Ship of Magic","Liveship Traders","Robin Hobb","Series",2,"Read","On Shelf",""],
  ["Ship of Destiny","Liveship Traders","Robin Hobb","Series",3,"Read","On Shelf",""],
  ["Renegade's Magic","Soldier Son","Robin Hobb","Series",null,"Read","On Shelf",""],
  ["Fool's Errand","Tawny Man","Robin Hobb","Series",1,"Read","On Shelf",""],
  ["The Golden Fool","Tawny Man","Robin Hobb","Series",2,"Read","On Shelf",""],
  ["Fool's Fate","Tawny Man","Robin Hobb","Series",3,"Read","On Shelf",""],
  ["Fool's Assassin","The Fitz and the Fool","Robin Hobb","Series",1,"Read","On Shelf",""],
  ["Fool's Quest","The Fitz and the Fool","Robin Hobb","Series",2,"Read","On Shelf",""],
  ["Assassin's Fate","The Fitz and the Fool","Robin Hobb","Series",3,"Read","On Shelf",""],
  ["Dragon Keeper","The Rain Wild Chronicles","Robin Hobb","Series",1,"Not Read","On Shelf",""],
  ["Blood of Dragons","The Rain Wild Chronicles","Robin Hobb","Series",2,"Not Read","On Shelf",""],
  ["City of Dragons","The Rain Wild Chronicles","Robin Hobb","Series",3,"Not Read","On Shelf",""],
  ["Dragon Haven","The Rain Wild Chronicles","Robin Hobb","Series",4,"Not Read","On Shelf",""],
  ["The Lies of Locke Lamora","Gentleman Bastard","Scott Lynch","Series",1,"Read","On Shelf",""],
  ["Red Seas Under Red Skies","Gentleman Bastard","Scott Lynch","Series",2,"Read","On Shelf",""],
  ["The Republic of Thieves","Gentleman Bastard","Scott Lynch","Series",3,"Read","On Shelf",""],
  ["The High Druid's Blade","The Defenders of Shannara","Terry Brooks","Series",1,"Read","On Shelf",""],
  ["The Darkling Child","The Defenders of Shannara","Terry Brooks","Series",2,"Read","On Shelf",""],
  ["The Sorcerer's Daughter","The Defenders of Shannara","Terry Brooks","Series",3,"Read","On Shelf",""],
  ["The Sword of Shannara","The Sword of Shannara","Terry Brooks","Series",1,"Read","On Shelf",""],
  ["The Elfstones of Shannara","The Sword of Shannara","Terry Brooks","Series",2,"Read","On Shelf",""],
  ["The Wishsong of Shannara","The Sword of Shannara","Terry Brooks","Series",3,"Read","On Shelf",""],
  ["Wizard's First Rule","The Sword of Truth","Terry Goodkind","Series",1,"Read","On Shelf",""],
  ["Stone of Tears","The Sword of Truth","Terry Goodkind","Series",2,"Read","On Shelf",""],
  ["Blood of the Fold","The Sword of Truth","Terry Goodkind","Series",3,"Read","On Shelf",""],
  ["Temple of the Winds","The Sword of Truth","Terry Goodkind","Series",4,"Read","On Shelf",""],
  ["Soul of the Fire","The Sword of Truth","Terry Goodkind","Series",5,"Read","On Shelf",""],
  ["Faith of the Fallen","The Sword of Truth","Terry Goodkind","Series",6,"Read","On Shelf",""],
  ["Pillars of Creation","The Sword of Truth","Terry Goodkind","Series",7,"Read","On Shelf",""],
  ["Naked Empire","The Sword of Truth","Terry Goodkind","Series",8,"Read","On Shelf",""],
  ["Debt of Bones","The Sword of Truth","Terry Goodkind","Prequel/Novella","8.5","Read","On Shelf",""],
  ["Chainfire","The Sword of Truth","Terry Goodkind","Series",9,"Read","On Shelf",""],
  ["Phantom","The Sword of Truth","Terry Goodkind","Series",10,"Read","On Shelf",""],
  ["Confessor","The Sword of Truth","Terry Goodkind","Series",11,"Read","On Shelf",""],
  ["A Hat Full of Sky","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["Guards! Guards!","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["Making Money","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["Reaper Man","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["The Truth","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["The Wee Free Men","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["Wintersmith","Discworld","Terry Pratchett","Stand Alone",null,"Read","On Shelf",""],
  ["Children of Hurin","Middle Earth","J.R.R. Tolkien","Stand Alone",null,"Read","On Shelf",""],
  ["Thief's Magic","Millennium's Rule","Trudi Canavan","Series",1,"Read","On Shelf",""],
  ["Angel of Storms","Millennium's Rule","Trudi Canavan","Series",2,"Read","On Shelf",""],
  ["Successor's Promise","Millennium's Rule","Trudi Canavan","Series",3,"Read","On Shelf",""],
  ["Maker's Curse","Millennium's Rule","Trudi Canavan","Series",4,"Read","On Shelf",""],
  ["Priestess of the White","The Age of the Five","Trudi Canavan","Series",1,"Read","On Shelf",""],
  ["Last of the Wilds","The Age of the Five","Trudi Canavan","Series",2,"Read","On Shelf",""],
  ["Voice of the Gods","The Age of the Five","Trudi Canavan","Series",3,"Read","On Shelf",""],
  ["The Magician's Apprentice","The Black Magician","Trudi Canavan","Prequel/Novella","0.5","Read","On Shelf",""],
  ["The Magician's Guild","The Black Magician","Trudi Canavan","Series",1,"Read","On Shelf",""],
  ["The Novice","The Black Magician","Trudi Canavan","Series",2,"Read","On Shelf",""],
  ["The High Lord","The Black Magician","Trudi Canavan","Series",3,"Read","On Shelf",""],
  ["The Blade Itself","The First Law Trilogy","Joe Abercrombie","Series",1,"Read","On Shelf",""],
  ["Before They Were Hanged","The First Law Trilogy","Joe Abercrombie","Series",2,"Read","On Shelf",""],
  ["Last Argument of Kings","The First Law Trilogy","Joe Abercrombie","Series",3,"Not Read","On Shelf",""],
].map((row, i) => ({
  id: `seed-${i}`,
  title: row[0],
  seriesName: row[1],
  author: row[2],
  seriesType: row[3],
  bookNum: row[4],
  read: row[5],
  shelf: row[6],
  borrower: row[7] || "",
  rating: "",
  notes: "",
  cover: null,
  coverTried: false,
}));

const OWNER_EMAIL = "reuvenjacobs97@gmail.com";
const DEFAULT_PIN = "1234";

// Paste the Google Apps Script Web App URL here once you've deployed it.
// Leave blank to skip sheet sync.
const SHEET_SYNC_URL = "https://script.google.com/macros/s/AKfycby5MU2446IZyiUOWzA9skDgcjzG6akrWMXHXyRkj8qhbOZ_XeMtzwnFd6_92H4AX_RwOQ/exec";
// Shared secret the Apps Script checks before writing anything.
const SHEET_SYNC_SECRET = "b185c6609b7c91918e360168eb3de6b5";

// Set NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY in Vercel's Environment Variables
// to raise the cover-lookup quota well above the anonymous limit.
const GOOGLE_BOOKS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || "";

async function syncBookToSheet(book) {
  if (!SHEET_SYNC_URL) return;
  try {
    await fetch(SHEET_SYNC_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret: SHEET_SYNC_SECRET,
        title: book.title,
        author: book.author,
        read: book.read,
        shelf: book.shelf,
        borrower: book.borrower,
      }),
    });
  } catch {
    // Non-critical — the app's own storage is still the source of truth.
  }
}

const PALETTE = {
  bg: "#1b1712",
  panel: "#241f19",
  panelRaised: "#2c261e",
  hairline: "#3c3327",
  brass: "#c19a49",
  brassDim: "#8a7239",
  cream: "#eee6d6",
  creamDim: "#a89a82",
  onShelf: "#7a9b7e",
  onLoan: "#c17a45",
  notRead: "#7d6a8f",
  danger: "#b5563f",
};

function keyFor(book) {
  return `${book.title} ${book.author}`;
}

function initials(title) {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function hueFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export default function ReuvensLibrary() {
  const [books, setBooks] = useState(null);
  const [requests, setRequests] = useState([]);
  const [ownerPin, setOwnerPin] = useState(DEFAULT_PIN);
  const [ownerUnlocked, setOwnerUnlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [shelfFilter, setShelfFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");

  const [selectedBook, setSelectedBook] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [newPin, setNewPin] = useState("");

  const [showRequests, setShowRequests] = useState(false);
  const [requesterName, setRequesterName] = useState("");
  const [requestMode, setRequestMode] = useState(false);
  const [sentInfo, setSentInfo] = useState(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // ---------- Initial load ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let booksData;
        try {
          const res = await storage.get("books");
          booksData = res ? res.value : null;
        } catch {
          booksData = null;
        }
        if (!booksData) {
          booksData = SEED_BOOKS;
          await storage.set("books", booksData);
        } else {
          const existingKeys = new Set(
            booksData.map((b) => `${b.title}|${b.author}`.toLowerCase())
          );
          const missing = SEED_BOOKS.filter(
            (b) => !existingKeys.has(`${b.title}|${b.author}`.toLowerCase())
          );
          if (missing.length > 0) {
            booksData = [...booksData, ...missing];
            await storage.set("books", booksData);
          }
        }

        // One-time reset: retry any book still missing a cover with the
        // improved multi-result matching, instead of leaving it stuck.
        booksData = booksData.map((b) => (!b.cover ? { ...b, coverTried: false } : b));

        let pin = DEFAULT_PIN;
        try {
          const res = await storage.get("owner-pin");
          pin = res ? String(res.value) : DEFAULT_PIN;
        } catch {
          await storage.set("owner-pin", DEFAULT_PIN);
        }

        let reqs = [];
        try {
          const res = await storage.get("requests");
          reqs = res ? res.value : [];
        } catch {
          reqs = [];
        }

        if (!cancelled) {
          setBooks(booksData);
          setOwnerPin(pin);
          setRequests(reqs);
          setLoaded(true);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Couldn't load the library. Try refreshing.");
          setBooks(SEED_BOOKS);
          setLoaded(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---------- Cover fetching (slow, retry-safe) ----------
  useEffect(() => {
    if (!books) return;
    const need = books.filter((b) => !b.cover && !b.coverTried);
    if (need.length === 0) return;

    let cancelled = false;
    const DELAY_MS = 400;

    async function fetchCover(book) {
      try {
        const q = encodeURIComponent(`intitle:${book.title} inauthor:${book.author}`);
        const r = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5${GOOGLE_BOOKS_API_KEY ? `&key=${GOOGLE_BOOKS_API_KEY}` : ""}`
        );
        if (r.status === 429) {
          return { cover: null, tried: false, rateLimited: true };
        }
        if (!r.ok) {
          return { cover: null, tried: true, rateLimited: false };
        }
        const data = await r.json();
        const items = data?.items || [];
        let img = null;
        for (const item of items) {
          const links = item?.volumeInfo?.imageLinks;
          if (links?.thumbnail || links?.smallThumbnail) {
            img = links.thumbnail || links.smallThumbnail;
            break;
          }
        }
        return { cover: img ? img.replace("http://", "https://") : null, tried: true, rateLimited: false };
      } catch {
        return { cover: null, tried: false, rateLimited: false };
      }
    }

    (async () => {
      let current = books;
      for (const book of need) {
        if (cancelled) return;
        const result = await fetchCover(book);
        current = current.map((b) =>
          b.id === book.id ? { ...b, cover: result.cover, coverTried: result.tried } : b
        );
        if (!cancelled) setBooks(current);
        if (result.rateLimited) break;
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
      if (!cancelled) {
        try {
          await storage.set("books", current);
        } catch {}
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const saveBooks = useCallback(async (next) => {
    setBooks(next);
    try {
      await storage.set("books", next);
    } catch {
      showToast("Couldn't save — check your connection.");
    }
  }, [showToast]);

  const saveRequests = useCallback(async (next) => {
    setRequests(next);
    try {
      await storage.set("requests", next);
    } catch {
      showToast("Couldn't save the request.");
    }
  }, [showToast]);

  // ---------- Owner unlock ----------
  function tryUnlock() {
    if (String(pinInput).trim() === String(ownerPin).trim()) {
      setOwnerUnlocked(true);
      setShowPinModal(false);
      setPinInput("");
      setPinError("");
      showToast("Edit mode unlocked.");
    } else {
      setPinError("Wrong PIN.");
    }
  }

  async function changePin() {
    if (newPin.trim().length < 3) {
      showToast("PIN needs at least 3 characters.");
      return;
    }
    try {
      await storage.set("owner-pin", newPin.trim());
      setOwnerPin(newPin.trim());
      setNewPin("");
      showToast("PIN updated.");
    } catch {
      showToast("Couldn't update the PIN.");
    }
  }

  // ---------- Book edits (owner only) ----------
  async function updateBook(id, patch) {
    const next = books.map((b) => (b.id === id ? { ...b, ...patch } : b));
    await saveBooks(next);
    if (selectedBook?.id === id) setSelectedBook({ ...selectedBook, ...patch });
    const updated = next.find((b) => b.id === id);
    if (updated) syncBookToSheet(updated);
  }

  // ---------- Requests ----------
  async function submitRequest(book) {
    const name = requesterName.trim();
    if (!name) {
      showToast("Enter your name first.");
      return;
    }
    const req = {
      id: `req-${Date.now()}`,
      bookId: book.id,
      title: book.title,
      author: book.author,
      requester: name,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
    await saveRequests([req, ...requests]);
    const subject = encodeURIComponent(`Book request: ${book.title}`);
    const body = encodeURIComponent(
      `${name} requested to borrow "${book.title}" by ${book.author}.\n\nOpen the library app to approve or deny this request.`
    );
    const mailtoHref = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
    setRequestMode(false);
    setRequesterName("");
    setSentInfo({ title: book.title, mailtoHref });
    showToast("Request saved.");
  }

  async function approveRequest(req) {
    await updateBook(req.bookId, { shelf: "On Loan", borrower: req.requester });
    await saveRequests(requests.map((r) => (r.id === req.id ? { ...r, status: "approved" } : r)));
    showToast(`Marked "${req.title}" on loan to ${req.requester}.`);
  }

  async function denyRequest(req) {
    await saveRequests(requests.map((r) => (r.id === req.id ? { ...r, status: "denied" } : r)));
    showToast("Request denied.");
  }

  // ---------- Filtering & grouping ----------
  const filtered = useMemo(() => {
    if (!books) return [];
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (shelfFilter !== "all" && b.shelf !== shelfFilter) return false;
      if (readFilter !== "all" && b.read !== readFilter) return false;
      if (q && !(`${b.title} ${b.author} ${b.seriesName}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [books, query, shelfFilter, readFilter]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const b of filtered) {
      if (!map.has(b.author)) map.set(b.author, []);
      map.get(b.author).push(b);
    }
    for (const [, list] of map) {
      list.sort((a, b) => {
        if (a.seriesName !== b.seriesName) return (a.seriesName || "").localeCompare(b.seriesName || "");
        const an = parseFloat(a.bookNum) || 0;
        const bn = parseFloat(b.bookNum) || 0;
        return an - bn;
      });
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  if (!loaded) {
    return (
      <div style={{ ...styles.app, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: PALETTE.creamDim, fontFamily: "'Source Serif 4', serif" }}>Opening the shelves…</div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <style>{FONT_IMPORT}</style>

      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>Reuven's Library</h1>
          <p style={styles.subtitle}>{books.length} books on the shelf</p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.iconBtn}
            title={ownerUnlocked ? "Editing unlocked" : "Unlock editing"}
            onClick={() => (ownerUnlocked ? setShowSettings(true) : setShowPinModal(true))}
          >
            {ownerUnlocked ? <Unlock size={18} color={PALETTE.brass} /> : <Lock size={18} color={PALETTE.creamDim} />}
          </button>
          <button style={styles.iconBtn} title="Requests" onClick={() => setShowRequests(true)}>
            <Bell size={18} color={PALETTE.creamDim} />
            {pendingCount > 0 && <span style={styles.badge}>{pendingCount}</span>}
          </button>
        </div>
      </header>

      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <Search size={15} color={PALETTE.creamDim} />
          <input
            style={styles.searchInput}
            placeholder="Search title, author, series…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={styles.chips}>
          {["all", "On Shelf", "On Loan"].map((v) => (
            <button
              key={v}
              onClick={() => setShelfFilter(v)}
              style={{ ...styles.chip, ...(shelfFilter === v ? styles.chipActive : {}) }}
            >
              {v === "all" ? "All" : v}
            </button>
          ))}
          {["all", "Read", "Not Read"].map((v) => (
            <button
              key={v}
              onClick={() => setReadFilter(v)}
              style={{ ...styles.chip, ...(readFilter === v ? styles.chipActive : {}) }}
            >
              {v === "all" ? "Any progress" : v}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <main style={styles.main}>
        {grouped.length === 0 && (
          <div style={styles.emptyState}>No books match that search.</div>
        )}
        {grouped.map(([author, list]) => (
          <section key={author} style={styles.shelfSection}>
            <div style={styles.shelfLabel}>
              <span>{author}</span>
              <span style={styles.shelfRule} />
              <span style={styles.shelfCount}>{list.length}</span>
            </div>
            <div style={styles.shelfRow}>
              {list.map((b) => (
                <BookCard key={b.id} book={b} onClick={() => { setSelectedBook(b); setRequestMode(false); setSentInfo(null); }} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          ownerUnlocked={ownerUnlocked}
          requestMode={requestMode}
          requesterName={requesterName}
          setRequesterName={setRequesterName}
          sentInfo={sentInfo}
          onRequestStart={() => setRequestMode(true)}
          onRequestCancel={() => setRequestMode(false)}
          onRequestSubmit={() => submitRequest(selectedBook)}
          onUpdate={(patch) => updateBook(selectedBook.id, patch)}
          onClose={() => { setSelectedBook(null); setRequestMode(false); setSentInfo(null); }}
        />
      )}

      {showPinModal && (
        <Overlay onClose={() => { setShowPinModal(false); setPinInput(""); setPinError(""); }}>
          <h3 style={styles.modalTitle}>Unlock editing</h3>
          <p style={styles.modalText}>Enter the owner PIN to change statuses and manage requests.</p>
          <input
            style={styles.pinInput}
            type="password"
            autoFocus
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
            placeholder="PIN"
          />
          {pinError && <div style={styles.pinError}>{pinError}</div>}
          <button style={styles.primaryBtn} onClick={tryUnlock}>Unlock</button>
        </Overlay>
      )}

      {showSettings && (
        <Overlay onClose={() => setShowSettings(false)}>
          <h3 style={styles.modalTitle}><Settings size={16} style={{ verticalAlign: "-2px", marginRight: 6 }} />Owner settings</h3>
          <p style={styles.modalText}>Editing is unlocked for this session.</p>
          <label style={styles.fieldLabel}>Change PIN</label>
          <input
            style={styles.pinInput}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            placeholder="New PIN"
          />
          <button style={styles.primaryBtn} onClick={changePin}>Save PIN</button>
          <button
            style={styles.textBtn}
            onClick={() => { setOwnerUnlocked(false); setShowSettings(false); showToast("Editing locked."); }}
          >
            Lock editing for this session
          </button>
        </Overlay>
      )}

      {showRequests && (
        <Overlay onClose={() => setShowRequests(false)} wide>
          <h3 style={styles.modalTitle}>Requests</h3>
          {requests.length === 0 && <p style={styles.modalText}>No requests yet.</p>}
          <div style={styles.reqList}>
            {requests.map((r) => (
              <div key={r.id} style={styles.reqRow}>
                <div>
                  <div style={styles.reqTitle}>{r.title}</div>
                  <div style={styles.reqMeta}>from {r.requester} · {new Date(r.requestedAt).toLocaleDateString()}</div>
                </div>
                {r.status === "pending" ? (
                  ownerUnlocked ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={styles.smallIconBtn} onClick={() => approveRequest(r)} title="Approve">
                        <Check size={14} color={PALETTE.onShelf} />
                      </button>
                      <button style={styles.smallIconBtn} onClick={() => denyRequest(r)} title="Deny">
                        <Ban size={14} color={PALETTE.danger} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ ...styles.statusPill, color: PALETTE.brass }}>Pending</span>
                  )
                ) : (
                  <span style={{ ...styles.statusPill, color: r.status === "approved" ? PALETTE.onShelf : PALETTE.danger }}>
                    {r.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Overlay>
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

function BookCard({ book, onClick }) {
  const hue = hueFromString(keyFor(book));
  const onLoan = book.shelf === "On Loan";
  return (
    <button style={styles.card} onClick={onClick}>
      <div style={styles.coverWrap}>
        {book.cover ? (
          <img src={book.cover} alt="" style={styles.coverImg} />
        ) : (
          <div style={{ ...styles.coverPlaceholder, background: `hsl(${hue}, 28%, 22%)`, color: `hsl(${hue}, 45%, 78%)` }}>
            {initials(book.title)}
          </div>
        )}
        {onLoan && <div style={styles.loanBanner}>On Loan</div>}
        <span
          style={{
            ...styles.statusDot,
            background: onLoan ? PALETTE.onLoan : PALETTE.onShelf,
          }}
        />
      </div>
      <div style={styles.cardTitle}>{book.title}</div>
      {book.seriesName ? <div style={styles.cardSeries}>{book.seriesName}{book.bookNum ? ` · #${book.bookNum}` : ""}</div> : null}
    </button>
  );
}

function BookModal({ book, ownerUnlocked, requestMode, requesterName, setRequesterName, sentInfo, onRequestStart, onRequestCancel, onRequestSubmit, onUpdate, onClose }) {
  const hue = hueFromString(keyFor(book));
  return (
    <Overlay onClose={onClose}>
      <div style={styles.detailTop}>
        <div style={styles.detailCoverWrap}>
          {book.cover ? (
            <img src={book.cover} alt="" style={styles.detailCoverImg} />
          ) : (
            <div style={{ ...styles.detailCoverPlaceholder, background: `hsl(${hue}, 28%, 22%)`, color: `hsl(${hue}, 45%, 78%)` }}>
              {initials(book.title)}
            </div>
          )}
        </div>
        <div>
          <h3 style={styles.modalTitle}>{book.title}</h3>
          <div style={styles.modalText}>{book.author}</div>
          {book.seriesName && (
            <div style={styles.modalTextDim}>{book.seriesName}{book.bookNum ? `, book ${book.bookNum}` : ""} · {book.seriesType}</div>
          )}
        </div>
      </div>

      {!ownerUnlocked && (
        <div style={styles.statusRow}>
          <span style={{ ...styles.statusPill, color: book.read === "Read" ? PALETTE.onShelf : PALETTE.notRead }}>{book.read}</span>
          <span style={{ ...styles.statusPill, color: book.shelf === "On Shelf" ? PALETTE.onShelf : PALETTE.onLoan }}>
            {book.shelf}{book.shelf === "On Loan" && book.borrower ? ` · ${book.borrower}` : ""}
          </span>
        </div>
      )}

      {ownerUnlocked ? (
        <div style={styles.editGrid}>
          <label style={styles.fieldLabel}>Read status</label>
          <select style={styles.select} value={book.read} onChange={(e) => onUpdate({ read: e.target.value })}>
            <option>Read</option>
            <option>Not Read</option>
          </select>
          <label style={styles.fieldLabel}>Shelf status</label>
          <select
            style={styles.select}
            value={book.shelf}
            onChange={(e) => {
              const val = e.target.value;
              onUpdate(val === "On Shelf" ? { shelf: val, borrower: "" } : { shelf: val });
            }}
          >
            <option>On Shelf</option>
            <option>On Loan</option>
          </select>
          {book.shelf === "On Loan" && (
            <>
              <label style={styles.fieldLabel}>Borrower</label>
              <input style={styles.select} value={book.borrower} onChange={(e) => onUpdate({ borrower: e.target.value })} />
            </>
          )}
          <label style={styles.fieldLabel}>Notes</label>
          <textarea style={{ ...styles.select, minHeight: 60 }} value={book.notes} onChange={(e) => onUpdate({ notes: e.target.value })} />
        </div>
      ) : (
        <>
          {sentInfo && sentInfo.title === book.title ? (
            <div style={styles.editGrid}>
              <p style={styles.modalText}>Request saved — the owner will see it in their Requests panel.</p>
              <a
                href={sentInfo.mailtoHref}
                style={{ ...styles.primaryBtn, display: "inline-flex", alignItems: "center", textDecoration: "none", width: "fit-content" }}
              >
                <Mail size={14} style={{ marginRight: 6 }} />Also email the owner
              </a>
            </div>
          ) : book.shelf === "On Shelf" ? (
            requestMode ? (
              <div style={styles.editGrid}>
                <label style={styles.fieldLabel}>Your name</label>
                <input
                  style={styles.select}
                  autoFocus
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onRequestSubmit()}
                  placeholder="e.g. Akiva"
                />
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  <button style={styles.primaryBtn} onClick={onRequestSubmit}>Send request</button>
                  <button style={styles.textBtn} onClick={onRequestCancel}>Cancel</button>
                </div>
              </div>
            ) : (
              <button style={styles.primaryBtn} onClick={onRequestStart}>Request to borrow</button>
            )
          ) : (
            <p style={styles.modalTextDim}>Currently on loan{book.borrower ? ` to ${book.borrower}` : ""}.</p>
          )}
          {book.notes && <p style={styles.modalTextDim}>{book.notes}</p>}
        </>
      )}
    </Overlay>
  );
}

function Overlay({ children, onClose, wide }) {
  return (
    <div style={styles.overlayBg} onClick={onClose}>
      <div style={{ ...styles.overlayCard, ...(wide ? { maxWidth: 480 } : {}) }} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}><X size={16} color={PALETTE.creamDim} /></button>
        {children}
      </div>
    </div>
  );
}

const FONT_IMPORT = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
`;

const styles = {
  app: {
    minHeight: "100vh",
    background: PALETTE.bg,
    color: PALETTE.cream,
    fontFamily: "'Inter', sans-serif",
    padding: "28px 20px 60px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: 980,
    margin: "0 auto 18px",
  },
  h1: {
    fontFamily: "'Source Serif 4', serif",
    fontWeight: 600,
    fontSize: 32,
    margin: 0,
    letterSpacing: "0.2px",
  },
  subtitle: { margin: "4px 0 0", color: PALETTE.creamDim, fontSize: 13 },
  headerActions: { display: "flex", gap: 8 },
  iconBtn: {
    position: "relative",
    background: PALETTE.panel,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: PALETTE.brass,
    color: "#231d15",
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 999,
    minWidth: 16,
    height: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  },
  toolbar: {
    maxWidth: 980,
    margin: "0 auto 30px",
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: PALETTE.panel,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    padding: "8px 12px",
    flex: "1 1 220px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: PALETTE.cream,
    fontSize: 14,
    width: "100%",
    fontFamily: "'Inter', sans-serif",
  },
  chips: { display: "flex", gap: 6, flexWrap: "wrap" },
  chip: {
    background: "transparent",
    border: `1px solid ${PALETTE.hairline}`,
    color: PALETTE.creamDim,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12,
    cursor: "pointer",
  },
  chipActive: { borderColor: PALETTE.brassDim, color: PALETTE.brass, background: "rgba(193,154,73,0.08)" },
  errorBanner: {
    maxWidth: 980,
    margin: "0 auto 16px",
    background: "rgba(181,86,63,0.12)",
    border: `1px solid ${PALETTE.danger}`,
    color: "#e3b6a9",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
  },
  main: { maxWidth: 980, margin: "0 auto" },
  emptyState: { color: PALETTE.creamDim, textAlign: "center", padding: "60px 0" },
  shelfSection: { marginBottom: 34 },
  shelfLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Source Serif 4', serif",
    fontSize: 16,
    color: PALETTE.brass,
    marginBottom: 14,
  },
  shelfRule: { flex: 1, height: 1, background: PALETTE.hairline },
  shelfCount: { fontFamily: "'Inter', sans-serif", fontSize: 12, color: PALETTE.creamDim },
  shelfRow: { display: "flex", flexWrap: "wrap", gap: 16 },
  card: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    width: 108,
    textAlign: "left",
    padding: 0,
    color: PALETTE.cream,
  },
  coverWrap: { position: "relative", width: 108, height: 154, borderRadius: 4, overflow: "hidden", boxShadow: "0 6px 14px rgba(0,0,0,0.4)" },
  coverImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Source Serif 4', serif",
    fontSize: 24,
  },
  statusDot: { position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", boxShadow: "0 0 0 2px rgba(0,0,0,0.5)" },
  loanBanner: {
    position: "absolute",
    top: "44%",
    left: "-10%",
    width: "120%",
    textAlign: "center",
    background: "rgba(193, 122, 69, 0.94)",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    padding: "3px 0",
    transform: "rotate(-8deg)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontSize: 12.5, marginTop: 8, lineHeight: 1.3 },
  cardSeries: { fontSize: 11, color: PALETTE.creamDim, marginTop: 2 },
  overlayBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,8,5,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 20,
  },
  overlayCard: {
    background: PALETTE.panelRaised,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    position: "relative",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  closeBtn: { position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer" },
  modalTitle: { fontFamily: "'Source Serif 4', serif", fontSize: 20, margin: "0 0 6px", paddingRight: 20 },
  modalText: { fontSize: 13.5, color: PALETTE.cream, margin: "0 0 4px" },
  modalTextDim: { fontSize: 13, color: PALETTE.creamDim, margin: "10px 0 0", lineHeight: 1.5 },
  detailTop: { display: "flex", gap: 14, marginBottom: 14 },
  detailCoverWrap: { width: 84, height: 120, borderRadius: 4, overflow: "hidden", flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.4)" },
  detailCoverImg: { width: "100%", height: "100%", objectFit: "cover" },
  detailCoverPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Source Serif 4', serif", fontSize: 22 },
  statusRow: { display: "flex", gap: 8, margin: "6px 0 14px" },
  statusPill: {
    fontSize: 11.5,
    fontWeight: 600,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 999,
    padding: "4px 10px",
  },
  pinInput: {
    width: "100%",
    background: PALETTE.panel,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    padding: "10px 12px",
    color: PALETTE.cream,
    fontSize: 14,
    marginBottom: 10,
    boxSizing: "border-box",
  },
  pinError: { color: PALETTE.danger, fontSize: 12.5, marginBottom: 10 },
  primaryBtn: {
    background: PALETTE.brass,
    color: "#241d13",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontWeight: 600,
    fontSize: 13.5,
    cursor: "pointer",
  },
  textBtn: {
    background: "none",
    border: "none",
    color: PALETTE.creamDim,
    fontSize: 12.5,
    marginTop: 10,
    cursor: "pointer",
    display: "block",
  },
  fieldLabel: { fontSize: 11.5, color: PALETTE.creamDim, marginBottom: 4, display: "block", marginTop: 10 },
  select: {
    width: "100%",
    background: PALETTE.panel,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    padding: "8px 10px",
    color: PALETTE.cream,
    fontSize: 13.5,
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  },
  editGrid: { display: "flex", flexDirection: "column" },
  reqList: { display: "flex", flexDirection: "column", gap: 10, marginTop: 10 },
  reqRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: PALETTE.panel,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 8,
    padding: "10px 12px",
  },
  reqTitle: { fontSize: 13.5 },
  reqMeta: { fontSize: 11.5, color: PALETTE.creamDim, marginTop: 2 },
  smallIconBtn: {
    background: PALETTE.panelRaised,
    border: `1px solid ${PALETTE.hairline}`,
    borderRadius: 6,
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    background: PALETTE.panelRaised,
    border: `1px solid ${PALETTE.hairline}`,
    color: PALETTE.cream,
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    zIndex: 60,
  },
};
