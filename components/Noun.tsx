import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";

/** Renders Noun avatar with fallback */
export function Noun({ }: {}) {
    return (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
}
