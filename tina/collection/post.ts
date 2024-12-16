import type { Collection } from "tinacms";

const Post: Collection = {
  label: "Blog Posts",
  name: "post",
  path: "content/posts",
  format: "md",
  ui: {
    router: ({ document }) => {
      return `/posts/${document._sys.breadcrumbs.join("/")}`;
    },
  },
  fields: [
    {
      name: 'category',
      label: 'Category',
      type: 'string',
      options: ['Blog', 'Editorial', 'Collaboration', 'Interview', 'Podcast', 'New Drop'],
    },
    {
      type: "string",
      label: "Title",
      name: "title",
      isTitle: true,
      required: true,
    },
    {
      type: "string",
      label: "Slug",
      name: "slug",
      required: true,
    },
    {
      type: "image",
      name: "heroImg",
      label: "Hero Image",
    },
    {
      type: "rich-text",
      label: "Excerpt",
      name: "excerpt",
    },
    {
      type: "reference",
      label: "Author",
      name: "author",
      collections: ["author"],
    },
    {
      type: "datetime",
      label: "Posted Date",
      name: "date",
      ui: {
        dateFormat: "MMMM DD YYYY",
        timeFormat: "hh:mm A",
      },
    },
    {
      type: "rich-text",
      label: "Body",
      name: "_body",
      templates: [
        {
          name: "DateTime",
          label: "Date & Time",
          inline: true,
          fields: [
            {
              name: "format",
              label: "Format",
              type: "string",
              options: ["utc", "iso", "local"],
            },
          ],
        },
        {
          name: "BlockQuote",
          label: "Block Quote",
          fields: [
            {
              name: "children",
              label: "Quote",
              type: "rich-text",
            },
            {
              name: "authorName",
              label: "Author",
              type: "string",
            },
          ],
        },
      ],
      isBody: true,
    },
  ],
};

export default Post;
