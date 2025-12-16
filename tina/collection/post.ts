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
      options: ['Blogs', 'Editorials', 'Collaborations', 'Interviews', 'Podcasts', 'New Drops', 'News'],
    },
    {
      type: "string",
      name: "manufacturerCodes",
      label: "Manufacturer Codes",
      list: true,
      description: "Add one or more manufacturer codes found in Magento 2. For example MY_JEWELLERY",
    },
    {
      type: "string",
      name: "categoryCodes",
      label: "Category Codes",
      list: true,
      description: "Add one or more category codes found in Magento 2. For example H/SCHOENEN/SNEAKERS",
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
      description: 'Use lowercase letters only',
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
