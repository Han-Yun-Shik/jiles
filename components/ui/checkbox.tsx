import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

export default function CustomCheckbox({
  id,
  checked,
  onCheckedChange,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Checkbox.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="checkbox-root"
      >
        <Checkbox.Indicator className="checkbox-indicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id}>내용을 확인했습니다.</label>
    </div>
  );
}
