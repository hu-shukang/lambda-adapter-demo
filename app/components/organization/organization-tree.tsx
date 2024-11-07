import { OrganizationInfo } from '~/models/organization.model';
import TreeView, { TreeNode } from '../ui/tree-view';
import { useCallback, useMemo, useState } from 'react';

type Props = {
  data: OrganizationInfo[];
  updateHandler: (pk: string) => void;
  removeHandler: (info: OrganizationInfo) => void;
};

function toTreeNode(
  organizations: OrganizationInfo[],
  organization: OrganizationInfo,
  showed: Set<string>,
): TreeNode<OrganizationInfo> {
  const children: Array<TreeNode<OrganizationInfo>> = [];
  const childOrg = organizations.filter((o) => o.parent === organization.pk);
  const otherOrg = organizations.filter((o) => o.parent !== organization.pk);
  for (let i = 0; i < childOrg.length; i++) {
    const childTreeNode = toTreeNode(otherOrg, childOrg[i], showed);
    children.push(childTreeNode);
  }
  const node: TreeNode<OrganizationInfo> = {
    id: organization.pk,
    show: showed.has(organization.pk),
    origin: organization,
    children: children.length > 0 ? children : undefined,
  };

  return node;
}

function toTree(organizations: OrganizationInfo[], showed: Set<string>): TreeNode<OrganizationInfo> {
  const root = organizations.find((o) => o.parent === undefined) as OrganizationInfo;
  const otherOrg = organizations.filter((o) => o.parent !== undefined);
  return toTreeNode(otherOrg, root, showed);
}

export default function OrganizationTree({ data }: Props) {
  const [showed, setShowed] = useState<Set<string>>(new Set(data.map((o) => o.pk)));

  const organizationTree = useMemo(() => toTree(data, showed), [data, showed]);

  const toggleShowHandler = useCallback(
    (node: TreeNode<OrganizationInfo>) => {
      const updatedShowed = new Set(showed);
      if (node.show) {
        updatedShowed.delete(node.id);
      } else {
        updatedShowed.add(node.id);
      }
      setShowed(updatedShowed);
    },
    [showed],
  );

  const renderNodeElement = (node: TreeNode<OrganizationInfo>) => (
    <div className="inline-flex items-center space-x-2">
      <label
        htmlFor={node.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {node.origin.name}
      </label>
    </div>
  );

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <TreeView node={organizationTree} toggleShow={toggleShowHandler} renderNodeElement={renderNodeElement} />
      </div>
    </div>
  );
}
