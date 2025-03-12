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
          className="w-10 h-10 rounded-full p-0 bg-[#efefef] hover:bg-[#dbdbdb] outline-none focus:ring-0"
        >
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-[#2563eb] text-white text-sm font-medium">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="bg-white border border-[#efefef] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-0 min-w-[250px]" 
        align="end"
      >
        <div className="px-5 py-4 border-b border-[#efefef]">
          <p className="text-sm font-semibold text-[#262626]">{user?.email}</p>
          <p className="text-xs text-[#8e8e8e] truncate mt-1">
            User ID: {user?.id?.substring(0, 12)}...
          </p>
        </div>
        
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem 
            className="px-5 py-3 text-sm text-[#262626] hover:bg-[#fafafa] cursor-pointer focus:bg-[#fafafa] rounded-lg mx-1"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 mr-3 text-[#8e8e8e]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="px-5 py-3 text-sm text-[#262626] hover:bg-[#fafafa] cursor-pointer focus:bg-[#fafafa] rounded-lg mx-1"
            onClick={toggleCurrency}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 mr-3 text-[#8e8e8e]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="6" x2="12" y2="12"></line>
              <path d="M8 12h8"></path>
            </svg>
            <div className="flex justify-between items-center w-full">
              <span>Currency</span>
              <span className="ml-4 text-[#262626] font-medium bg-[#efefef] px-2 py-0.5 rounded-full text-xs">{currencyPreference}</span>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="px-5 py-3 text-sm text-[#262626] hover:bg-[#fafafa] cursor-pointer focus:bg-[#fafafa] rounded-lg mx-1"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 mr-3 text-[#8e8e8e]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <div className="border-t border-[#efefef] py-1 mt-1">
          <DropdownMenuItem 
            className="px-5 py-3 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 cursor-pointer focus:bg-[#ef4444]/10 rounded-lg mx-1"
            onClick={handleSignOut}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 mr-3" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
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