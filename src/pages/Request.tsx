import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PrimaryButton from "@/components/PrimaryButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Upload } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

const Request = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: searchParams.get("service") || "",
    description: "",
    preferredDate: "",
    preferredTime: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zip: searchParams.get("zip") || "",
    image: null as File | null,
  });

  const [zipError, setZipError] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(true);
  const [zipDropdownOpen, setZipDropdownOpen] = useState(false);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const services = [
    "Plumbing",
    "Electrical",
    "House Cleaning",
    "AC Repair",
    "Appliance Repair",
    "Painting",
    "Handyman",
    "Pest Control",
    "Lawn Care",
    "Moving",
  ];

  const timeSlots = [
    "Morning (8AM - 12PM)",
    "Afternoon (12PM - 5PM)",
    "Evening (5PM - 8PM)",
    "Emergency (ASAP)",
  ];

  // Maryland ZIP codes with corresponding cities and counties
  const marylandZipCodes = [
    // Southern Maryland (20601-20699)
    { zip: "20601", city: "Waldorf", county: "Charles County" },
    { zip: "20602", city: "Waldorf", county: "Charles County" },
    { zip: "20603", city: "Waldorf", county: "Charles County" },
    { zip: "20606", city: "Accokeek", county: "Prince George's County" },
    { zip: "20607", city: "Aquasco", county: "Prince George's County" },
    { zip: "20608", city: "Avenue", county: "St. Mary's County" },
    { zip: "20609", city: "Barstow", county: "Calvert County" },
    { zip: "20610", city: "Bel Alton", county: "Charles County" },
    { zip: "20611", city: "Benedict", county: "Charles County" },
    { zip: "20612", city: "Brandywine", county: "Prince George's County" },
    { zip: "20613", city: "Broomes Island", county: "Calvert County" },
    { zip: "20615", city: "Bryans Road", county: "Charles County" },
    { zip: "20616", city: "Bryantown", county: "Charles County" },
    { zip: "20617", city: "Bushwood", county: "St. Mary's County" },
    { zip: "20618", city: "California", county: "St. Mary's County" },
    { zip: "20619", city: "Callaway", county: "St. Mary's County" },
    { zip: "20620", city: "Chaptico", county: "St. Mary's County" },
    { zip: "20621", city: "Charlotte Hall", county: "St. Mary's County" },
    { zip: "20622", city: "Cheltenham", county: "Prince George's County" },
    { zip: "20623", city: "Clements", county: "St. Mary's County" },
    { zip: "20624", city: "Cobb Island", county: "Charles County" },
    { zip: "20625", city: "Coltons Point", county: "St. Mary's County" },
    { zip: "20626", city: "Compton", county: "St. Mary's County" },
    { zip: "20627", city: "Dameron", county: "St. Mary's County" },
    { zip: "20628", city: "Dowell", county: "Calvert County" },
    { zip: "20629", city: "Drayden", county: "St. Mary's County" },
    { zip: "20630", city: "Faulkner", county: "Charles County" },
    { zip: "20632", city: "Great Mills", county: "St. Mary's County" },
    { zip: "20634", city: "Hollywood", county: "St. Mary's County" },
    { zip: "20635", city: "Hughesville", county: "Charles County" },
    { zip: "20636", city: "Huntingtown", county: "Calvert County" },
    { zip: "20637", city: "Indian Head", county: "Charles County" },
    { zip: "20639", city: "Ironsides", county: "Charles County" },
    { zip: "20640", city: "Issue", county: "Charles County" },
    { zip: "20643", city: "La Plata", county: "Charles County" },
    { zip: "20645", city: "Leonardtown", county: "St. Mary's County" },
    { zip: "20646", city: "Lexington Park", county: "St. Mary's County" },
    { zip: "20650", city: "Lusby", county: "Calvert County" },
    { zip: "20653", city: "Mechanicsville", county: "St. Mary's County" },
    { zip: "20656", city: "Morganza", county: "St. Mary's County" },
    { zip: "20657", city: "Mount Victoria", county: "Charles County" },
    { zip: "20658", city: "Nanjemoy", county: "Charles County" },
    { zip: "20659", city: "Newburg", county: "Charles County" },
    { zip: "20660", city: "Park Hall", county: "St. Mary's County" },
    { zip: "20661", city: "Patuxent River", county: "St. Mary's County" },
    { zip: "20662", city: "Piney Point", county: "St. Mary's County" },
    { zip: "20664", city: "Pomfret", county: "Charles County" },
    { zip: "20667", city: "Port Republic", county: "Calvert County" },
    { zip: "20670", city: "Prince Frederick", county: "Calvert County" },
    { zip: "20674", city: "Ridge", county: "St. Mary's County" },
    { zip: "20675", city: "Rock Point", county: "Charles County" },
    { zip: "20676", city: "Saint Inigoes", county: "St. Mary's County" },
    { zip: "20677", city: "Saint Leonard", county: "Calvert County" },
    { zip: "20678", city: "Saint Marys City", county: "St. Mary's County" },
    { zip: "20680", city: "Solomons", county: "Calvert County" },
    { zip: "20682", city: "Sunderland", county: "Calvert County" },
    { zip: "20684", city: "Tall Timbers", county: "St. Mary's County" },
    { zip: "20685", city: "Valley Lee", county: "St. Mary's County" },
    { zip: "20687", city: "Welcome", county: "Charles County" },
    { zip: "20688", city: "White Plains", county: "Charles County" },
    { zip: "20689", city: "White Plains", county: "Charles County" },
    { zip: "20690", city: "White Plains", county: "Charles County" },
    { zip: "20692", city: "White Plains", county: "Charles County" },
    { zip: "20693", city: "White Plains", county: "Charles County" },
    { zip: "20695", city: "White Plains", county: "Charles County" },
    { zip: "20697", city: "White Plains", county: "Charles County" },

    // Prince George's County and parts of Howard and Anne Arundel Counties (20701-20799)
    { zip: "20701", city: "Annapolis Junction", county: "Howard County" },
    { zip: "20704", city: "Fort George G Meade", county: "Anne Arundel County" },
    { zip: "20705", city: "Andrews Air Force Base", county: "Prince George's County" },
    { zip: "20706", city: "Lanham", county: "Prince George's County" },
    { zip: "20707", city: "Lanham", county: "Prince George's County" },
    { zip: "20708", city: "Bladensburg", county: "Prince George's County" },
    { zip: "20710", city: "Lothian", county: "Anne Arundel County" },
    { zip: "20711", city: "Mount Rainier", county: "Prince George's County" },
    { zip: "20712", city: "North Beach", county: "Calvert County" },
    { zip: "20714", city: "Bowie", county: "Prince George's County" },
    { zip: "20715", city: "Bowie", county: "Prince George's County" },
    { zip: "20716", city: "Bowie", county: "Prince George's County" },
    { zip: "20717", city: "Bowie", county: "Prince George's County" },
    { zip: "20718", city: "Bowie", county: "Prince George's County" },
    { zip: "20719", city: "Bowie", county: "Prince George's County" },
    { zip: "20720", city: "Bowie", county: "Prince George's County" },
    { zip: "20721", city: "Bowie", county: "Prince George's County" },
    { zip: "20722", city: "Brentwood", county: "Prince George's County" },
    { zip: "20723", city: "Laurel", county: "Prince George's County" },
    { zip: "20724", city: "Laurel", county: "Prince George's County" },
    { zip: "20725", city: "Laurel", county: "Prince George's County" },
    { zip: "20726", city: "Laurel", county: "Prince George's County" },
    { zip: "20731", city: "Capitol Heights", county: "Prince George's County" },
    { zip: "20732", city: "Chesapeake Beach", county: "Calvert County" },
    { zip: "20733", city: "Churchton", county: "Anne Arundel County" },
    { zip: "20735", city: "Clinton", county: "Prince George's County" },
    { zip: "20736", city: "Clinton", county: "Prince George's County" },
    { zip: "20737", city: "Clinton", county: "Prince George's County" },
    { zip: "20738", city: "Clinton", county: "Prince George's County" },
    { zip: "20740", city: "College Park", county: "Prince George's County" },
    { zip: "20741", city: "College Park", county: "Prince George's County" },
    { zip: "20742", city: "College Park", county: "Prince George's County" },
    { zip: "20743", city: "College Park", county: "Prince George's County" },
    { zip: "20744", city: "College Park", county: "Prince George's County" },
    { zip: "20745", city: "College Park", county: "Prince George's County" },
    { zip: "20746", city: "College Park", county: "Prince George's County" },
    { zip: "20747", city: "College Park", county: "Prince George's County" },
    { zip: "20748", city: "College Park", county: "Prince George's County" },
    { zip: "20749", city: "College Park", county: "Prince George's County" },
    { zip: "20750", city: "College Park", county: "Prince George's County" },
    { zip: "20751", city: "College Park", county: "Prince George's County" },
    { zip: "20752", city: "College Park", county: "Prince George's County" },
    { zip: "20753", city: "College Park", county: "Prince George's County" },
    { zip: "20754", city: "College Park", county: "Prince George's County" },
    { zip: "20755", city: "College Park", county: "Prince George's County" },
    { zip: "20757", city: "Oxon Hill", county: "Prince George's County" },
    { zip: "20758", city: "Suitland", county: "Prince George's County" },
    { zip: "20759", city: "District Heights", county: "Prince George's County" },
    { zip: "20762", city: "Riverdale", county: "Prince George's County" },
    { zip: "20763", city: "Riverdale", county: "Prince George's County" },
    { zip: "20764", city: "Riverdale", county: "Prince George's County" },
    { zip: "20765", city: "Riverdale", county: "Prince George's County" },
    { zip: "20768", city: "Forestville", county: "Prince George's County" },
    { zip: "20769", city: "Forestville", county: "Prince George's County" },
    { zip: "20770", city: "Forestville", county: "Prince George's County" },
    { zip: "20771", city: "Forestville", county: "Prince George's County" },
    { zip: "20772", city: "Forestville", county: "Prince George's County" },
    { zip: "20773", city: "Forestville", county: "Prince George's County" },
    { zip: "20774", city: "Forestville", county: "Prince George's County" },
    { zip: "20775", city: "Forestville", county: "Prince George's County" },
    { zip: "20776", city: "Forestville", county: "Prince George's County" },
    { zip: "20777", city: "Forestville", county: "Prince George's County" },
    { zip: "20778", city: "Forestville", county: "Prince George's County" },
    { zip: "20779", city: "Forestville", county: "Prince George's County" },
    { zip: "20780", city: "Forestville", county: "Prince George's County" },
    { zip: "20781", city: "Forestville", county: "Prince George's County" },
    { zip: "20782", city: "Forestville", county: "Prince George's County" },
    { zip: "20783", city: "Forestville", county: "Prince George's County" },
    { zip: "20784", city: "Forestville", county: "Prince George's County" },
    { zip: "20785", city: "Forestville", county: "Prince George's County" },
    { zip: "20786", city: "Forestville", county: "Prince George's County" },
    { zip: "20787", city: "Forestville", county: "Prince George's County" },
    { zip: "20788", city: "Forestville", county: "Prince George's County" },
    { zip: "20789", city: "Forestville", county: "Prince George's County" },
    { zip: "20790", city: "Forestville", county: "Prince George's County" },
    { zip: "20791", city: "Forestville", county: "Prince George's County" },
    { zip: "20792", city: "Forestville", county: "Prince George's County" },
    { zip: "20793", city: "Forestville", county: "Prince George's County" },
    { zip: "20794", city: "Forestville", county: "Prince George's County" },
    { zip: "20795", city: "Forestville", county: "Prince George's County" },
    { zip: "20796", city: "Forestville", county: "Prince George's County" },
    { zip: "20797", city: "Forestville", county: "Prince George's County" },
    { zip: "20798", city: "Forestville", county: "Prince George's County" },
    { zip: "20799", city: "Forestville", county: "Prince George's County" },

    // Montgomery County (20810-20899, 20901-20999)
    { zip: "20810", city: "Bethesda", county: "Montgomery County" },
    { zip: "20811", city: "Bethesda", county: "Montgomery County" },
    { zip: "20812", city: "Glen Echo", county: "Montgomery County" },
    { zip: "20813", city: "Bethesda", county: "Montgomery County" },
    { zip: "20814", city: "Bethesda", county: "Montgomery County" },
    { zip: "20815", city: "Chevy Chase", county: "Montgomery County" },
    { zip: "20816", city: "Bethesda", county: "Montgomery County" },
    { zip: "20817", city: "Bethesda", county: "Montgomery County" },
    { zip: "20818", city: "Cabin John", county: "Montgomery County" },
    { zip: "20824", city: "Bethesda", county: "Montgomery County" },
    { zip: "20825", city: "Chevy Chase", county: "Montgomery County" },
    { zip: "20827", city: "Bethesda", county: "Montgomery County" },
    { zip: "20830", city: "Olney", county: "Montgomery County" },
    { zip: "20832", city: "Olney", county: "Montgomery County" },
    { zip: "20833", city: "Brookeville", county: "Montgomery County" },
    { zip: "20837", city: "Poolesville", county: "Montgomery County" },
    { zip: "20838", city: "Barnesville", county: "Montgomery County" },
    { zip: "20839", city: "Beallsville", county: "Montgomery County" },
    { zip: "20841", city: "Boyds", county: "Montgomery County" },
    { zip: "20842", city: "Dickerson", county: "Montgomery County" },
    { zip: "20847", city: "Rockville", county: "Montgomery County" },
    { zip: "20848", city: "Rockville", county: "Montgomery County" },
    { zip: "20849", city: "Rockville", county: "Montgomery County" },
    { zip: "20850", city: "Rockville", county: "Montgomery County" },
    { zip: "20851", city: "Rockville", county: "Montgomery County" },
    { zip: "20852", city: "Rockville", county: "Montgomery County" },
    { zip: "20853", city: "Rockville", county: "Montgomery County" },
    { zip: "20854", city: "Potomac", county: "Montgomery County" },
    { zip: "20855", city: "Derwood", county: "Montgomery County" },
    { zip: "20857", city: "Rockville", county: "Montgomery County" },
    { zip: "20859", city: "Potomac", county: "Montgomery County" },
    { zip: "20860", city: "Sandy Spring", county: "Montgomery County" },
    { zip: "20861", city: "Ashton", county: "Montgomery County" },
    { zip: "20862", city: "Brinklow", county: "Montgomery County" },
    { zip: "20866", city: "Burtonsville", county: "Montgomery County" },
    { zip: "20868", city: "Spencerville", county: "Montgomery County" },
    { zip: "20871", city: "Clarksburg", county: "Montgomery County" },
    { zip: "20872", city: "Damascus", county: "Montgomery County" },
    { zip: "20874", city: "Germantown", county: "Montgomery County" },
    { zip: "20875", city: "Germantown", county: "Montgomery County" },
    { zip: "20876", city: "Germantown", county: "Montgomery County" },
    { zip: "20877", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20878", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20879", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20880", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20882", city: "Washington Grove", county: "Montgomery County" },
    { zip: "20883", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20884", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20885", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20886", city: "Montgomery Village", county: "Montgomery County" },
    { zip: "20889", city: "Bethesda", county: "Montgomery County" },
    { zip: "20891", city: "Kensington", county: "Montgomery County" },
    { zip: "20892", city: "Bethesda", county: "Montgomery County" },
    { zip: "20894", city: "Bethesda", county: "Montgomery County" },
    { zip: "20895", city: "Kensington", county: "Montgomery County" },
    { zip: "20896", city: "Bethesda", county: "Montgomery County" },
    { zip: "20897", city: "Bethesda", county: "Montgomery County" },
    { zip: "20898", city: "Gaithersburg", county: "Montgomery County" },
    { zip: "20899", city: "Gaithersburg", county: "Montgomery County" },

    // 20901-20999 (Montgomery County)
    { zip: "20901", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20902", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20903", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20904", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20905", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20906", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20907", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20908", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20909", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20910", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20911", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20912", city: "Takoma Park", county: "Montgomery County" },
    { zip: "20913", city: "Takoma Park", county: "Montgomery County" },
    { zip: "20914", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20915", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20916", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20918", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20993", city: "Silver Spring", county: "Montgomery County" },
    { zip: "20997", city: "Silver Spring", county: "Montgomery County" },

    // Anne Arundel, Baltimore, Harford, and Howard Counties (21001-21099)
    { zip: "21001", city: "Aberdeen", county: "Harford County" },
    { zip: "21005", city: "Aberdeen Proving Ground", county: "Harford County" },
    { zip: "21009", city: "Abingdon", county: "Harford County" },
    { zip: "21010", city: "Gunpowder", county: "Baltimore County" },
    { zip: "21012", city: "Arnold", county: "Anne Arundel County" },
    { zip: "21013", city: "Baldwin", county: "Baltimore County" },
    { zip: "21014", city: "Bel Air", county: "Harford County" },
    { zip: "21015", city: "Bel Air", county: "Harford County" },
    { zip: "21017", city: "Belcamp", county: "Harford County" },
    { zip: "21018", city: "Benson", county: "Harford County" },
    { zip: "21020", city: "Boring", county: "Baltimore County" },
    { zip: "21022", city: "Brooklandville", county: "Baltimore County" },
    { zip: "21023", city: "Butler", county: "Baltimore County" },
    { zip: "21027", city: "Chase", county: "Baltimore County" },
    { zip: "21028", city: "Churchville", county: "Harford County" },
    { zip: "21029", city: "Clarksville", county: "Howard County" },
    { zip: "21030", city: "Cockeysville", county: "Baltimore County" },
    { zip: "21031", city: "Hunt Valley", county: "Baltimore County" },
    { zip: "21032", city: "Crownsville", county: "Anne Arundel County" },
    { zip: "21034", city: "Davidsonville", county: "Anne Arundel County" },
    { zip: "21035", city: "Dayton", county: "Howard County" },
    { zip: "21036", city: "Edgewater", county: "Anne Arundel County" },
    { zip: "21037", city: "Edgewood", county: "Harford County" },
    { zip: "21040", city: "Elkridge", county: "Howard County" },
    { zip: "21041", city: "Elkton", county: "Cecil County" },
    { zip: "21042", city: "Elkton", county: "Cecil County" },
    { zip: "21043", city: "Elkton", county: "Cecil County" },
    { zip: "21044", city: "Elkton", county: "Cecil County" },
    { zip: "21045", city: "Columbia", county: "Howard County" },
    { zip: "21046", city: "Columbia", county: "Howard County" },
    { zip: "21050", city: "Fallston", county: "Harford County" },
    { zip: "21051", city: "Finksburg", county: "Carroll County" },
    { zip: "21052", city: "Forest Hill", county: "Harford County" },
    { zip: "21053", city: "Fork", county: "Baltimore County" },
    { zip: "21054", city: "Fort Howard", county: "Baltimore County" },
    { zip: "21056", city: "Freeland", county: "Baltimore County" },
    { zip: "21057", city: "Gambrills", county: "Anne Arundel County" },
    { zip: "21060", city: "Gibson Island", county: "Anne Arundel County" },
    { zip: "21061", city: "Glen Arm", county: "Baltimore County" },
    { zip: "21062", city: "Glen Burnie", county: "Anne Arundel County" },
    { zip: "21065", city: "Glen Burnie", county: "Anne Arundel County" },
    { zip: "21071", city: "Glyndon", county: "Baltimore County" },
    { zip: "21074", city: "Hampstead", county: "Carroll County" },
    { zip: "21075", city: "Ellicott City", county: "Howard County" },
    { zip: "21076", city: "Ellicott City", county: "Howard County" },
    { zip: "21077", city: "Ellicott City", county: "Howard County" },
    { zip: "21078", city: "Ellicott City", county: "Howard County" },
    { zip: "21082", city: "Hanover", county: "Anne Arundel County" },
    { zip: "21084", city: "Harmans", county: "Anne Arundel County" },
    { zip: "21085", city: "Havre De Grace", county: "Harford County" },
    { zip: "21087", city: "Hydes", county: "Baltimore County" },
    { zip: "21088", city: "Jarrettsville", county: "Harford County" },
    { zip: "21090", city: "Joppa", county: "Harford County" },
    { zip: "21092", city: "Kingsville", county: "Baltimore County" },
    { zip: "21093", city: "Lineboro", county: "Carroll County" },
    { zip: "21094", city: "Linthicum Heights", county: "Anne Arundel County" },
    { zip: "21098", city: "Lutherville Timonium", county: "Baltimore County" },
    { zip: "21099", city: "Lutherville Timonium", county: "Baltimore County" },

    // Carroll, Baltimore, and Harford Counties (21101-21199)
    { zip: "21101", city: "Manchester", county: "Carroll County" },
    { zip: "21102", city: "Marriottsville", county: "Carroll County" },
    { zip: "21104", city: "Millers", county: "Carroll County" },
    { zip: "21105", city: "Monkton", county: "Baltimore County" },
    { zip: "21106", city: "New Windsor", county: "Carroll County" },
    { zip: "21108", city: "North East", county: "Cecil County" },
    { zip: "21111", city: "Nottingham", county: "Baltimore County" },
    { zip: "21113", city: "Owings Mills", county: "Baltimore County" },
    { zip: "21114", city: "Parkton", county: "Baltimore County" },
    { zip: "21117", city: "Perry Hall", county: "Baltimore County" },
    { zip: "21120", city: "Perryman", county: "Harford County" },
    { zip: "21122", city: "Phoenix", county: "Baltimore County" },
    { zip: "21123", city: "Pikesville", county: "Baltimore County" },
    { zip: "21128", city: "Reisterstown", county: "Baltimore County" },
    { zip: "21130", city: "Riderwood", county: "Baltimore County" },
    { zip: "21131", city: "Riva", county: "Anne Arundel County" },
    { zip: "21132", city: "Severna Park", county: "Anne Arundel County" },
    { zip: "21133", city: "Severna Park", county: "Anne Arundel County" },
    { zip: "21136", city: "Simpsonville", county: "Howard County" },
    { zip: "21139", city: "Sparks Glencoe", county: "Baltimore County" },
    { zip: "21140", city: "Stevenson", county: "Baltimore County" },
    { zip: "21144", city: "Street", county: "Harford County" },
    { zip: "21146", city: "Upperco", county: "Baltimore County" },
    { zip: "21150", city: "Upper Falls", county: "Baltimore County" },
    { zip: "21152", city: "Westminster", county: "Carroll County" },
    { zip: "21153", city: "Westminster", county: "Carroll County" },
    { zip: "21154", city: "Westminster", county: "Carroll County" },
    { zip: "21155", city: "Westminster", county: "Carroll County" },
    { zip: "21156", city: "Westminster", county: "Carroll County" },
    { zip: "21157", city: "Westminster", county: "Carroll County" },
    { zip: "21158", city: "Westminster", county: "Carroll County" },
    { zip: "21160", city: "White Hall", county: "Baltimore County" },
    { zip: "21161", city: "White Marsh", county: "Baltimore County" },
    { zip: "21162", city: "White Marsh", county: "Baltimore County" },
    { zip: "21163", city: "White Marsh", county: "Baltimore County" },
    { zip: "21199", city: "White Marsh", county: "Baltimore County" },

    // Baltimore City and surrounding Baltimore County (21201-21298)
    { zip: "21201", city: "Baltimore", county: "Baltimore City" },
    { zip: "21202", city: "Baltimore", county: "Baltimore City" },
    { zip: "21203", city: "Baltimore", county: "Baltimore City" },
    { zip: "21204", city: "Baltimore", county: "Baltimore County" },
    { zip: "21205", city: "Baltimore", county: "Baltimore City" },
    { zip: "21206", city: "Baltimore", county: "Baltimore City" },
    { zip: "21207", city: "Baltimore", county: "Baltimore County" },
    { zip: "21208", city: "Baltimore", county: "Baltimore County" },
    { zip: "21209", city: "Baltimore", county: "Baltimore County" },
    { zip: "21210", city: "Baltimore", county: "Baltimore City" },
    { zip: "21211", city: "Baltimore", county: "Baltimore City" },
    { zip: "21212", city: "Baltimore", county: "Baltimore City" },
    { zip: "21213", city: "Baltimore", county: "Baltimore City" },
    { zip: "21214", city: "Baltimore", county: "Baltimore City" },
    { zip: "21215", city: "Baltimore", county: "Baltimore City" },
    { zip: "21216", city: "Baltimore", county: "Baltimore City" },
    { zip: "21217", city: "Baltimore", county: "Baltimore City" },
    { zip: "21218", city: "Baltimore", county: "Baltimore City" },
    { zip: "21219", city: "Baltimore", county: "Baltimore City" },
    { zip: "21220", city: "Baltimore", county: "Baltimore City" },
    { zip: "21221", city: "Baltimore", county: "Baltimore City" },
    { zip: "21222", city: "Baltimore", county: "Baltimore City" },
    { zip: "21223", city: "Baltimore", county: "Baltimore City" },
    { zip: "21224", city: "Baltimore", county: "Baltimore City" },
    { zip: "21225", city: "Baltimore", county: "Baltimore City" },
    { zip: "21226", city: "Baltimore", county: "Baltimore City" },
    { zip: "21227", city: "Baltimore", county: "Baltimore City" },
    { zip: "21228", city: "Baltimore", county: "Baltimore City" },
    { zip: "21229", city: "Baltimore", county: "Baltimore City" },
    { zip: "21230", city: "Baltimore", county: "Baltimore City" },
    { zip: "21231", city: "Baltimore", county: "Baltimore City" },
    { zip: "21233", city: "Baltimore", county: "Baltimore City" },
    { zip: "21234", city: "Baltimore", county: "Baltimore County" },
    { zip: "21235", city: "Baltimore", county: "Baltimore County" },
    { zip: "21236", city: "Baltimore", county: "Baltimore County" },
    { zip: "21237", city: "Baltimore", county: "Baltimore County" },
    { zip: "21239", city: "Baltimore", county: "Baltimore City" },
    { zip: "21240", city: "Baltimore", county: "Baltimore City" },
    { zip: "21241", city: "Baltimore", county: "Baltimore City" },
    { zip: "21244", city: "Baltimore", county: "Baltimore City" },
    { zip: "21250", city: "Baltimore", county: "Baltimore City" },
    { zip: "21251", city: "Baltimore", county: "Baltimore City" },
    { zip: "21252", city: "Baltimore", county: "Baltimore City" },
    { zip: "21263", city: "Baltimore", county: "Baltimore City" },
    { zip: "21264", city: "Baltimore", county: "Baltimore City" },
    { zip: "21265", city: "Baltimore", county: "Baltimore City" },
    { zip: "21268", city: "Baltimore", county: "Baltimore City" },
    { zip: "21270", city: "Baltimore", county: "Baltimore City" },
    { zip: "21273", city: "Baltimore", county: "Baltimore City" },
    { zip: "21274", city: "Baltimore", county: "Baltimore City" },
    { zip: "21275", city: "Baltimore", county: "Baltimore City" },
    { zip: "21278", city: "Baltimore", county: "Baltimore City" },
    { zip: "21279", city: "Baltimore", county: "Baltimore City" },
    { zip: "21280", city: "Baltimore", county: "Baltimore City" },
    { zip: "21281", city: "Baltimore", county: "Baltimore City" },
    { zip: "21282", city: "Baltimore", county: "Baltimore City" },
    { zip: "21283", city: "Baltimore", county: "Baltimore City" },
    { zip: "21284", city: "Baltimore", county: "Baltimore City" },
    { zip: "21285", city: "Baltimore", county: "Baltimore City" },
    { zip: "21286", city: "Baltimore", county: "Baltimore City" },
    { zip: "21287", city: "Baltimore", county: "Baltimore City" },
    { zip: "21288", city: "Baltimore", county: "Baltimore City" },
    { zip: "21289", city: "Baltimore", county: "Baltimore City" },
    { zip: "21290", city: "Baltimore", county: "Baltimore City" },
    { zip: "21297", city: "Baltimore", county: "Baltimore City" },
    { zip: "21298", city: "Baltimore", county: "Baltimore City" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear ZIP error when user starts typing
    if (field === "zip") {
      setZipError("");
      setServiceAvailable(true);

      // Auto-fill city if ZIP code is valid Maryland ZIP
      if (value.length === 5) {
        const zipData = marylandZipCodes.find(zip => zip.zip === value);
        if (zipData) {
          setFormData(prev => ({ ...prev, city: `${zipData.city}, ${zipData.county}` }));
        }
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const validateZipCode = (zip: string) => {
    if (!zip.trim()) {
      return "ZIP code is required";
    }
    if (!/^\d+$/.test(zip)) {
      return "ZIP code must contain only digits";
    }
    if (zip.length !== 5) {
      return "ZIP code must be exactly 5 digits";
    }

    // Check if ZIP code is in Maryland
    const isMarylandZip = marylandZipCodes.some(zipData => zipData.zip === zip);
    if (!isMarylandZip) {
      setServiceAvailable(false);
      return "Service not available in this area. We currently serve Maryland only.";
    }

    setServiceAvailable(true);
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate ZIP code
    const zipValidation = validateZipCode(formData.zip);
    if (zipValidation) {
      setZipError(zipValidation);
      return;
    }

    // Generate subject and body from form fields (same as ContactFormModal)
    const subject = encodeURIComponent(`New Service Request from ${formData.name || 'Customer'} for ${formData.service || 'Service'}`);
    const body = encodeURIComponent(`
New Service Request:
Service: ${formData.service}
Description: ${formData.description}
Preferred Date: ${formData.preferredDate}
Preferred Time: ${formData.preferredTime}
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Address: ${formData.address}, ${formData.city}, ${formData.zip}
    `.trim());

    // Open Gmail compose window
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=kasiedu@expedite-consults.com&su=${subject}&body=${body}`, '_blank');

    // Redirect to success page
    setStep(4);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleZipSelect = (zipData: { zip: string; city: string; county: string }) => {
    handleInputChange("zip", zipData.zip);
    setFormData((prev) => ({ ...prev, city: `${zipData.city}, ${zipData.county}` }));
    setZipDropdownOpen(false);
    // Focus the ZIP input after selection
    setTimeout(() => zipInputRef.current?.blur(), 0);
  };

  // Filter ZIP codes based on input
  const filteredZipCodes = formData.zip
    ? marylandZipCodes.filter((zipData) => zipData.zip.startsWith(formData.zip))
    : marylandZipCodes;

  if (step === 4) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="font-heading text-3xl mb-4">
                  Request Submitted!
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Thanks! Our team will call you within minutes to confirm your
                  service details.
                </p>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-heading font-semibold mb-2">
                    What happens next?
                  </h3>
                  <ul className="text-left space-y-2 text-muted-foreground">
                    <li>
                      • We'll call you at {formData.phone} within 5 minutes
                    </li>
                    <li>• Confirm service details and scheduling</li>
                    <li>• Connect you with a local licensed professional</li>
                    <li>• Your pro will arrive at the scheduled time</li>
                  </ul>
                </div>
              </div>

              <PrimaryButton onClick={() => (window.location.href = "/")}>
                Return Home
              </PrimaryButton>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= num
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">
                  {step === 1 && "Service Details"}
                  {step === 2 && "Schedule & Contact"}
                  {step === 3 && "Address & Final Details"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Service Details */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service">
                          What service do you need?
                        </Label>
                        <Select
                          value={formData.service}
                          onValueChange={(value) =>
                            handleInputChange("service", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service}
                                value={service.toLowerCase()}
                              >
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">
                          Describe the issue or task
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Please provide details about what you need help with..."
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Upload a photo (optional)</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="image"
                            className="text-primary cursor-pointer hover:underline"
                          >
                            Click to upload an image
                          </label>
                          {formData.image && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              Selected: {formData.image.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Schedule & Contact */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">Preferred Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) =>
                              handleInputChange("preferredDate", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Preferred Time</Label>
                          <Select
                            value={formData.preferredTime}
                            onValueChange={(value) =>
                              handleInputChange("preferredTime", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="John Smith"
                          className={step === 2 && !formData.name ? "border-red-500" : ""}
                        />
                        {step === 2 && !formData.name && (
                          <p className="text-red-500 text-sm mt-1">Name is required to continue</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="(555) 123-4567"
                          className={step === 2 && !formData.phone ? "border-red-500" : ""}
                        />
                        {step === 2 && !formData.phone && (
                          <p className="text-red-500 text-sm mt-1">Phone number is required to continue</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email (optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          required
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            required
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Your City, County"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            required
                            value="MD"
                            readOnly
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP Code *</Label>
                          <div className="relative">
                          <Input
                            id="zip"
                            required
                            value={formData.zip}
                              onChange={(e) => {
                                handleInputChange("zip", e.target.value);
                                setZipDropdownOpen(true);
                              }}
                              placeholder="12345"
                              maxLength={5}
                              className={zipError ? "border-red-500" : ""}
                              onFocus={() => setZipDropdownOpen(true)}
                              ref={zipInputRef}
                            />
                            {/* Combobox for searching ZIP codes */}
                            {zipDropdownOpen && filteredZipCodes.length > 0 && (
                              <div className="absolute left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                                <Command>
                                  <CommandInput placeholder="Search ZIP code..." />
                                  <CommandList>
                                    <CommandEmpty>No ZIP found.</CommandEmpty>
                                    {filteredZipCodes.map((zipData) => (
                                      <CommandItem
                                        key={zipData.zip}
                                        value={zipData.zip}
                                        onSelect={() => handleZipSelect(zipData)}
                                      >
                                        {zipData.zip} - {zipData.city}, {zipData.county}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </div>
                            )}
                          </div>
                          {zipError && (
                            <p className="text-red-500 text-sm mt-1">{zipError}</p>
                          )}
                          {!zipError && formData.zip && serviceAvailable && (
                            <p className="text-green-600 text-sm mt-1">
                              ✓ Service available in {formData.city || "this area"}
                            </p>
                          )}
                          {!serviceAvailable && formData.zip && (
                            <p className="text-orange-600 text-sm mt-1">
                              ⚠ Service not available in this area. We currently serve Maryland only.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="font-heading font-semibold mb-2">
                          Review Your Request
                        </h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>
                            <strong>Service:</strong> {formData.service}
                          </li>
                          <li>
                            <strong>Date:</strong> {formData.preferredDate}
                          </li>
                          <li>
                            <strong>Time:</strong> {formData.preferredTime}
                          </li>
                          <li>
                            <strong>Contact:</strong> {formData.name} -{" "}
                            {formData.phone}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {step > 1 && (
                      <PrimaryButton
                        type="button"
                        variant="primary"
                        onClick={prevStep}
                      >
                        Previous
                      </PrimaryButton>
                    )}

                    <div className="ml-auto">
                      {step < 3 ? (
                        <div>
                        <PrimaryButton
                          type="button"
                          onClick={nextStep}
                          disabled={
                            (step === 1 && !formData.service) ||
                            (step === 2 && (!formData.name || !formData.phone))
                          }
                        >
                          Next
                        </PrimaryButton>
                          {step === 2 && (!formData.name || !formData.phone) && (
                            <p className="text-orange-600 text-sm mt-2 text-center">
                              Please fill in all required fields to continue
                            </p>
                          )}
                        </div>
                      ) : (
                        <PrimaryButton
                          type="submit"
                          disabled={
                            !formData.address ||
                            !formData.city ||
                            !formData.zip ||
                            !!zipError ||
                            !serviceAvailable
                          }
                        >
                          Submit Request
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Request;
