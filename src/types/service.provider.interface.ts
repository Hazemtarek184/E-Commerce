export interface IServiceProvider {
    name: string;
    bio: string;
    imagesUrl: string[];
    workingDays: string[];
    workingHours: string[];
    closingHours: string[];
    phoneConstact: phoneConstact[];
    locationLinks: string[];
    offers: offers[];
}

interface offers {
    name: string;
    description: string;
    imageUrl: string[];
}

interface phoneConstact {
    phoneNumber: string;
    hasWhatsApp: boolean;
    canCall: boolean;
}
