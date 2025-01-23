import { FC } from 'react';
import { ToggleHeaderProps } from './interface';

const ToggleHeader: FC<ToggleHeaderProps> = ({ className, title, exists }) => {
    if (!exists) return null;
    return <div className={className} >{title}</div>
}

export default ToggleHeader;
