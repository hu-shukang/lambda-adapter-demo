import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '~/lib/utils';
import { Paintbrush } from 'lucide-react';
import { Input } from './input';

const solids = [
  '#0094ff',
  '#FFA500',
  '#FFD700',
  '#808000',
  '#9ACD32',
  '#70e2ff',
  '#008B8B',
  '#EE82EE',
  '#4B0082',
  '#800080',
  '#FFC0CB',
  '#A52A2A',
  '#D2691E',
  '#DAA520',
  '#34495e',
  '#E2E2E2',
];

export default function ColorPicker({
  color,
  setColor,
  className,
}: {
  color: string;
  setColor: (color: string) => void;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[300px] justify-start text-left font-normal', !color && 'text-muted-foreground', className)}
        >
          <div className="w-full flex items-center gap-2">
            {color ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ backgroundColor: color }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="truncate flex-1">{color ? color : 'Pick a color'}</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <div className="grid grid-cols-8 grid-rows-2 gap-2">
          {solids.map((s) => (
            <div
              key={s}
              style={{ backgroundColor: s }}
              className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
              onClick={() => setColor(s)}
            />
          ))}
        </div>

        <Input
          id="custom"
          value={color}
          className="col-span-2 h-8 mt-4"
          onChange={(e) => setColor(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  );
}
