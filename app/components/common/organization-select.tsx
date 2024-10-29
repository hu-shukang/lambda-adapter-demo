import { useCallback, useState } from 'react';
import { OrganizationInfo } from '~/models/organization.model';
import { FormControl } from '../ui/form';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import OrganizationTreeView from './organization-treeview';
import { ScrollArea } from '../ui/scroll-area';

type Props = {
  organizations: OrganizationInfo[];
  selected: OrganizationInfo | undefined;
  onSelectChanged: (val: OrganizationInfo | undefined) => void;
};

export default function OrganizationSelect({ organizations, selected, onSelectChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [checkOrganization, setCheckOrganization] = useState<OrganizationInfo | undefined>(selected);

  const submitHandler = useCallback(() => {
    onSelectChanged(checkOrganization);
    setOpen(false);
  }, [checkOrganization, onSelectChanged]);

  const openChangedHandler = useCallback(
    (val: boolean) => {
      setOpen(val);
      setCheckOrganization(selected);
    },
    [selected],
  );

  return (
    <Dialog open={open} onOpenChange={openChangedHandler}>
      <DialogTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn('justify-between', !selected && 'text-muted-foreground')}
          >
            {selected ? selected?.name : '組織選択'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>組織選択</DialogTitle>
          <DialogDescription>組織を一つ選択してください。</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-6 py-1 border-y" type="auto">
          <OrganizationTreeView
            organizations={organizations}
            checked={checkOrganization}
            onCheckChanged={setCheckOrganization}
          />
        </ScrollArea>

        <DialogFooter>
          <Button type="submit" onClick={submitHandler}>
            選択
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
