export enum OperationType { READ = 'read', WRITE = 'write', DELETE = 'delete' }; export const handleFirestoreError = (e: any) => ({ success: false, error: String(e) });
