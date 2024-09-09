import { useNavigate } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

const GoBack = () => {
  const navigate = useNavigate();
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => {
        if (window.history.state.idx === 0) navigate("/dashboard/workout");
        else navigate(-1);
      }}
      className="rounded-full hover:bg-primary"
    >
      <ArrowLeft />
    </Button>
  );
};
export default GoBack;
