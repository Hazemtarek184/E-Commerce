export interface IServiceProvider {
    name: string;
    bio: string;
    imagesUrl: { url: string; public_id: string }[];
    workingDays: string[];
    workingHours: string[];
    closingHours: string[];
    phoneContacts: phoneContacts[];
    locationLinks: string[];
    offers?: offers[];
}

interface offers {
    name: string;
    description: string;
    imageUrl: string[];
}

interface phoneContacts {
    phoneNumber: string;
    hasWhatsApp: boolean;
    canCall: boolean;
}
