# R2 Avatars Index

## Location
- **Bucket:** `accredipro-assets`
- **Path:** `avatars/zombie-*.png`
- **Count:** 1,000 images

## Access

### Public URL
```
https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/{filename}
```

### API Credentials
```
AWS_ACCESS_KEY_ID=5b51a27a34062b14f7f25b2d16d0f4f5
AWS_SECRET_ACCESS_KEY=4fd5133a6a8dd01f3c4b016d98bd1ef0b21117800599e7f0bc0e6ee3f6eef125
ENDPOINT=https://5329609816d063edb11f40003176f19d.r2.cloudflarestorage.com
```

### List All Avatars
```bash
curl -s --aws-sigv4 "aws:amz:auto:s3" \
  --user "$AWS_ACCESS_KEY_ID:$AWS_SECRET_ACCESS_KEY" \
  "https://5329609816d063edb11f40003176f19d.r2.cloudflarestorage.com/accredipro-assets?list-type=2&prefix=avatars/&max-keys=1000"
```

## File Format

### Naming Convention
```
avatars/zombie-{cuid}.png
```

### Examples
- `avatars/zombie-cmk8w2agh002dxym97a1fana9.png`
- `avatars/zombie-cmk8w2ant002exym9qn2imknk.png`
- `avatars/zombie-cmk8w2ata002fxym9ntcoo8ar.png`

## Usage in Code

```typescript
// Construct avatar URL
const avatarUrl = `https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-${cuid}.png`;

// Or from database
const zombie = await prisma.zombieProfile.findFirst({
  where: { isActive: true }
});
const avatarUrl = zombie.avatar; // Already contains full URL
```

## Related Script

See: `/scripts/update-zombie-avatars-r2.ts` for updating avatar URLs in database
