import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Label } from '~/components/ui/label';
import { OrganizationInfo } from '~/models/organization.model';
import Error from '../common/error';

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  info: OrganizationInfo;
  data: OrganizationInfo[];
  deleteAction: (info: OrganizationInfo) => void;
  error: string | undefined;
};

export default function OrganizationDeleteConfirm({ open, setOpen, info, data, deleteAction, error }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ご確認</DialogTitle>
          <DialogDescription>
            下記の組織を削除してよろしいでしょうか。削除すると元に戻すことができません。
          </DialogDescription>
        </DialogHeader>
        <Error error={error} />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">組織名</Label>
            <div>{info.name}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">親組織</Label>
            <div>{data.find((item) => item.pk === info.parent)?.name || 'なし'}</div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => deleteAction(info)}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
