import { useState } from 'react';
import { TagInfo } from '~/models/tag.model';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { cn } from '~/lib/utils';
import { Badge } from './badge';
import { v7 } from 'uuid';
import { CONST } from '~/lib/const';
import { dateUtil } from '~/lib/date.util';

type Props = {
  placeholder: string;
  tags: TagInfo[];
  value: TagInfo | undefined;
  onChange: (tag: TagInfo | undefined) => void;
  onCreate: (val: TagInfo) => void;
};

export default function TagSelector({ placeholder, tags, value, onChange, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[145px] justify-between ${value === undefined ? 'text-muted-foreground' : ''}`}
        >
          {value ? value.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[145px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            <CommandEmpty>
              作成:{' '}
              <Badge
                className="cursor-pointer"
                onClick={() => {
                  const newTag = {
                    name: inputValue,
                    id: v7(),
                    category: CONST.TAG.ORGANIZATION,
                    updateTime: dateUtil.utc(),
                    updateUser: 'user',
                  };
                  onCreate(newTag);
                  onChange(newTag);
                  setOpen(false);
                  setInputValue('');
                }}
              >
                {inputValue}
              </Badge>
            </CommandEmpty>
            <CommandGroup>
              {tags.map((tag) => (
                <CommandItem
                  key={tag.name}
                  value={tag.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value?.name ? undefined : tag);
                    setOpen(false);
                  }}
                >
                  {tag.name}
                  <Check className={cn('ml-auto', 'w-4', 'h-4', value?.id === tag.id ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
