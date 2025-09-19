import React from "react";
import { Badge } from "@/components/ui/badge";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ProfileCompletionBadgeProps {
  className?: string;
}

export const ProfileCompletionBadge: React.FC<ProfileCompletionBadgeProps> = ({
  className = "",
}) => {
  const { completion, loading } = useProfileCompletion();

  if (loading) {
    return (
      <Badge variant="secondary" className={`${className}`}>
        <Clock className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    );
  }

  if (!completion) {
    return null;
  }

  const getBadgeVariant = () => {
    if (completion.completion >= 80) return "default";
    if (completion.completion >= 50) return "secondary";
    return "destructive";
  };

  const getIcon = () => {
    if (completion.completion >= 80)
      return <CheckCircle className="h-3 w-3 mr-1" />;
    if (completion.completion >= 50)
      return <AlertCircle className="h-3 w-3 mr-1" />;
    return <AlertCircle className="h-3 w-3 mr-1" />;
  };

  const getText = () => {
    if (completion.completion >= 80) return "Complete";
    if (completion.completion >= 50) return "In Progress";
    return "Incomplete";
  };

  return (
    <Badge variant={getBadgeVariant()} className={`${className}`}>
      {getIcon()}
      {getText()} ({completion.completion}%)
    </Badge>
  );
};
