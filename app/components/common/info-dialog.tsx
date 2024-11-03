import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  content: React.ReactElement | undefined;
  description?: string | undefined;
  onSubmit: () => void;
};

export default function InfoDialog({ open, setOpen, content, description, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>お知らせ</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{content}</div>
        <DialogFooter>
          <Button onClick={onSubmit}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
