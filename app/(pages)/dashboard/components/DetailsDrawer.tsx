import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type Props = {
  file: {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    updatedAt: string;
  };
};

export default function DetailsDrawer({ file }: Props) {
  return (
    <Drawer>
      <DrawerTrigger>
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-zinc-200 to-neutral-200" />
          <div className="flex-1 text-ellipsis overflow-hidden">
            {/* "text-ellipsis overflow-hidden" is same as "truncate" */}
            <h3 className="text-lg font-medium text-zinc-900 truncate">
              {file.name}
            </h3>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline" asChild>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
