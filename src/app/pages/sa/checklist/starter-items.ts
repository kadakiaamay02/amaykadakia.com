import { ChecklistItemInput, ChecklistKey } from '@app/services/s/wedding.service';

/**
 * Generic starting points offered when a checklist is empty. Nothing personal lives here:
 * this file is public on GitHub, while the real list (names, emails, dates) is stored on the server.
 */
export const STARTER_ITEMS: Record<ChecklistKey, ChecklistItemInput[]> = {
  engagement: [
    { title: 'Pick the engagement date', category: 'Planning' },
    { title: 'Set the engagement budget', category: 'Planning' },
    { title: 'Finalize the guest list', category: 'Guests' },
    { title: 'Book the venue', category: 'Venue' },
    { title: 'Send invitations', category: 'Guests' },
    { title: 'Choose the rings', category: 'Attire' },
    { title: 'Outfits for the couple', category: 'Attire' },
    { title: 'Book caterer and plan the menu', category: 'Food' },
    { title: 'Book photographer', category: 'Vendors' },
    { title: 'Decorations and flowers', category: 'Decor' },
    { title: 'Confirm officiant / priest for the ceremony', category: 'Ceremony' },
    { title: 'Gifts for both families', category: 'Gifts' },
  ],
  wedding: [
    { title: 'Set the overall budget', category: 'Planning' },
    { title: 'Choose the wedding date', category: 'Planning' },
    { title: 'Book the venue', category: 'Venue' },
    { title: 'Finalize the guest list', category: 'Guests' },
    { title: 'Send save-the-dates', category: 'Guests' },
    { title: 'Send invitations', category: 'Guests' },
    { title: 'Reserve a hotel room block for guests', category: 'Guests' },
    { title: 'Book caterer and plan the menu', category: 'Food' },
    { title: 'Book photographer and videographer', category: 'Vendors' },
    { title: 'Book decorator and florist', category: 'Decor' },
    { title: 'Book DJ / music', category: 'Vendors' },
    { title: 'Confirm officiant / priest', category: 'Ceremony' },
    { title: 'Wedding outfits for the couple', category: 'Attire' },
    { title: 'Book hair and makeup', category: 'Attire' },
    { title: 'Buy wedding rings', category: 'Attire' },
    { title: 'Arrange guest transportation', category: 'Logistics' },
    { title: 'Get the marriage license', category: 'Legal' },
    { title: 'Seating chart', category: 'Guests' },
    { title: 'Final payments to vendors', category: 'Planning' },
  ],
};
