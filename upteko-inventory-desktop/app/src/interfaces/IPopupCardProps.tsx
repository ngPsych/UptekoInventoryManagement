import { Item } from "./IItem";

interface PopupCardProps {
    item?: Item;
    onClose: () => void;
}

export default PopupCardProps;