export default function ChatMessage({ message, name, image }) {
    return (
      <div className="flex items-start gap-4 bg-backgroundnav p-3 rounded-md">
        <img src={image || "/image.png"} className="w-10 h-10 rounded-full self-start" />
        <div className="flex-1 min-w-0">
          <p className="font-kanit text-textcard font-[400] text-sm">{name}</p>
          <p className="text-muted text-xs break-words whitespace-normal">
            {message}
          </p>
        </div>
      </div>
    );
  }