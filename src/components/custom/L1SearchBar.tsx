import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="relative flex-1 max-w-md mx-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="搜索商品..."
        className="pl-8 w-full"
      />
    </div>
  );
}

export default SearchBar;