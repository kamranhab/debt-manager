import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from './ui/avatar';

export function ProfileMenu() {
  const { user, signOut, currencyPreference, updatePreference } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleCurrency = () => {
    updatePreference('currencyPreference', currencyPreference === 'INR' ? 'USD' : 'INR');
  };

  // Get initials from user email
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-9 h-9 rounded-full p-0 bg-slate-100 hover:bg-slate-200 outline-none focus:ring-0"
        >
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-slate-800 text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="bg-white border border-slate-100 rounded-none shadow-md p-0 min-w-[220px]" 
        align="end"
      >
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-sm font-medium text-slate-900">{user?.email}</p>
          <p className="text-xs text-slate-500 truncate mt-1">
            User ID: {user?.id?.substring(0, 12)}...
          </p>
        </div>
        
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem 
            className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer focus:bg-slate-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 mr-3 text-slate-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer focus:bg-slate-50"
            onClick={toggleCurrency}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 mr-3 text-slate-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="6" x2="12" y2="12"></line>
              <path d="M8 12h8"></path>
            </svg>
            <div className="flex justify-between items-center w-full">
              <span>Currency</span>
              <span className="ml-4 text-slate-900 font-medium">{currencyPreference}</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer focus:bg-slate-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 mr-3 text-slate-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <div className="border-t border-slate-100 py-1">
          <DropdownMenuItem 
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer focus:bg-red-50"
            onClick={handleSignOut}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-4 h-4 mr-3" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}