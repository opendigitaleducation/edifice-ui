import { RefAttributes, useState } from "react";

// Import Swiper React components
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import {
  Bookmark,
  Close,
  Copy,
  InfoCircle,
  Plus,
  RafterDown,
  Save,
  Search,
} from "@edifice-ui/icons";
import { Meta, StoryObj } from "@storybook/react";

import { Alert } from "../Alert";
import { TreeNode, TreeView } from "../TreeView";
import { Avatar } from "../Avatar";
import { Button, IconButton, SearchButton } from "../Button";
import { Checkbox, FormControl, Input, Label, Radio, Select } from "../Form";
import { OptionsType } from "../Form/Select";
import { Heading } from "../Heading";
import { ImagePicker } from "../ImagePicker";
import Modal, { ModalProps } from "./Modal";
import useToggle from "../../hooks/useToggle/useToggle";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  args: {
    id: "modal",
  },
  argTypes: {
    size: {
      options: ["md", "lg"],
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

const data: TreeNode = {
  id: "root",
  name: "Section Element",
  section: true,
  children: [
    {
      id: "1",
      name: "level 1 arborescence tree",
      children: [
        {
          id: "4",
          name: "level 2 arborescence tree",
          children: [
            {
              id: "8",
              name: "level 3 arborescence tree",
              children: [
                {
                  id: "12",
                  name: "level 4 arborescence tree",
                },
                {
                  id: "13",
                  name: "level 4 arborescence tree",
                },
              ],
            },
            {
              id: "9",
              name: "level 3 arborescence tree",
            },
          ],
        },
        {
          id: "5",
          name: "level 2 arborescence tree",
          children: [
            {
              id: "10",
              name: "level 3 arborescence tree",
            },
            {
              id: "11",
              name: "level 3 arborescence tree",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "level 1 arborescence tree",
      children: [
        {
          id: "6",
          name: "level 2 arborescence tree",
        },
        {
          id: "7",
          name: "level 2 arborescence tree",
        },
      ],
    },
    {
      id: "3",
      name: "level 1 arborescence tree",
    },
  ],
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Base: Story = {
  render: (args) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Open Modal
        </Button>
        {isOpen && (
          <Modal
            {...args}
            isOpen={isOpen}
            onModalClose={handleCloseModal}
            focusId="validateButtonId"
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Modal Header
            </Modal.Header>
            <Modal.Subtitle>Subtitle or description</Modal.Subtitle>
            <Modal.Body>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
                rutrum nunc et mollis varius. Donec quis imperdiet libero. Sed
                eleifend euismod ipsum, et elementum enim ultricies sed. Nunc
                convallis tempus viverra. Mauris faucibus dolor felis, ac
                consectetur purus aliquet id. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Aliquam
                imperdiet neque non neque bibendum, nec gravida sem lobortis.
                Cras mattis congue arcu, dictum dictum velit fermentum eget.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                id="validateButtonId"
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Validate
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    id: "primaryModal",
    size: "lg",
    scrollable: true,
  },
};

export const MoveFile = {
  render: (args: any) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Déplacer l'élément
        </Button>
        {isOpen && (
          <Modal {...args} isOpen={isOpen} onModalClose={handleCloseModal}>
            <Modal.Header onModalClose={handleCloseModal}>
              Déplacer
            </Modal.Header>
            <Modal.Subtitle>
              Sélectionner le dossier vers lequel déplacer les éléments
            </Modal.Subtitle>
            <Modal.Body>
              <TreeView data={data} />

              <div className="mt-48">
                <FormControl id="folder-name" className="d-flex gap-8">
                  <Input type="text" placeholder="Saisir un nom" size="md" />
                  <Button
                    color="primary"
                    onClick={() => {}}
                    type="button"
                    leftIcon={<Plus />}
                    variant="ghost"
                    className="text-nowrap"
                  >
                    Créer dossier
                  </Button>
                </FormControl>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Annuler
              </Button>
              <Button
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Déplacer
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    id: "moveFileModal",
    scrollable: true,
  },
};

export const CreateFile = {
  render: (
    args: JSX.IntrinsicAttributes & ModalProps & RefAttributes<HTMLDivElement>,
  ) => {
    const [isOpen, toggle] = useToggle(false);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Création
        </Button>
        {isOpen && (
          <Modal
            {...args}
            size="lg"
            isOpen={isOpen}
            onModalClose={handleCloseModal}
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Création
            </Modal.Header>

            <Modal.Body>
              <Heading headingStyle="h4" level="h3" className="mb-16">
                Général
              </Heading>

              <div className="d-flex flex-column flex-md-row gap-16 mb-24">
                <ImagePicker
                  app={{
                    address: "/blog",
                    icon: "blog-large",
                    name: "Blog",
                    scope: [],
                    display: false,
                    displayName: "",
                    isExternal: false,
                  }}
                  label="Upload an image"
                  addButtonLabel="Add image"
                  deleteButtonLabel="Delete image"
                  onUploadImage={() => {}}
                  onDeleteImage={() => {}}
                  className="align-self-center"
                />

                <div className="col">
                  <FormControl id="title" className="mb-16">
                    <Label>Titre</Label>
                    <Input
                      type="text"
                      placeholder="Nom de la ressource"
                      size="md"
                      aria-required={true}
                    />
                  </FormControl>
                  <FormControl id="description" isOptional>
                    <Label>Description</Label>
                    <Input
                      type="text"
                      placeholder="Nom de la ressource"
                      size="md"
                      aria-required={true}
                    />
                  </FormControl>
                </div>
              </div>

              <Heading headingStyle="h4" level="h3" className="mb-16">
                Accès au blog
              </Heading>

              <Alert type="info">
                Votre blog reste accessible aux personnes à qui vous l'avez
                partagé. Vous pouvez cependant créer un lien public afin que des
                personnes hors de l'ENT puissent y accéder.
              </Alert>

              <FormControl
                id="flexSwitchCheckDefault"
                className="form-check form-switch mt-16 mb-8"
              >
                <FormControl.Input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  size="md"
                />
                <FormControl.Label className="form-check-label">
                  Accessible publiquement via une URL
                </FormControl.Label>
              </FormControl>

              <FormControl id="slug">
                <div className="d-flex flex-wrap align-items-center gap-4">
                  <div>https://neoconnect.opendigitaleducation.com/</div>

                  <div className="flex-fill">
                    <Input
                      type="text"
                      size="md"
                      placeholder="extention personnalisée"
                    />
                  </div>
                  <Button
                    color="primary"
                    onClick={() => {}}
                    type="button"
                    leftIcon={<Copy />}
                    variant="ghost"
                    className="text-nowrap"
                  >
                    Copier URL
                  </Button>
                </div>
              </FormControl>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Annuler
              </Button>

              <Button
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Créer
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    id: "createModal",
    scrollable: false,
  },
};

// Sample to adapt
const sharingModelEdited: any = [
  {
    id: 0,
    hide: false,
    type: "group",
    username: "Enseignants du groupe CLG-DENIS POISSON",
    name: "Enseignants du groupe CLG-DENIS POISSON",
    avatarUrl:
      "https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=",
    actions: {
      read: true,
      write: true,
      manage: true,
      comment: 0,
    },
  },
  {
    id: 2,
    hide: false,
    type: "group",
    username: "Eleves du groupe CLG-DENIS POISSON",
    name: "Eleves du groupe CLG-DENIS POISSON",
    actions: {
      read: true,
      write: true,
      manage: true,
      comment: 0,
    },
  },
];

// Sample to adapt
const actions = [
  {
    displayName: "read",
  },
  {
    displayName: "write",
  },
  {
    displayName: "manage",
  },
  {
    displayName: "comment",
  },
];

export const ShareFile = {
  render: (args: any) => {
    const [isOpen, toggle] = useToggle(false);
    const [showBookmarkInput, toggleBookmarkInput] = useState(false);
    const [radioPublicationValue, setRadioPublicationValue] =
      useState<string>("now");
    const [items, setItems] = useState<any>(sharingModelEdited);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    const handleRadioPublicationChange = (event: any) => {
      setRadioPublicationValue(event.target.value);
    };

    const handleActionCheckbox = (item: any, actionName: string) => {
      setItems((prevItems: any[]) => {
        //item.actions[actionName] = !item.actions[actionName];
        const newItems = [...prevItems];
        const index = newItems.findIndex((x) => x.id == item.id);
        newItems[index].actions[actionName] =
          !newItems[index].actions[actionName];

        return newItems;
      });
    };

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Share
        </Button>
        {isOpen && (
          <Modal
            {...args}
            size="lg"
            isOpen={isOpen}
            onModalClose={handleCloseModal}
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Partager avec ...
            </Modal.Header>

            <Modal.Body>
              <Heading headingStyle="h4" level="h3" className="mb-16">
                Utilisateurs ayant accès
              </Heading>

              <div className="table-responsive">
                <table className="table border align-middle mb-0">
                  <thead className="bg-secondary text-white">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col"></th>
                      {actions.map((action) => (
                        <th
                          key={action.displayName}
                          scope="col"
                          className="text-center"
                        >
                          {action.displayName}
                        </th>
                      ))}
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any) => (
                      <tr key={item.id}>
                        <th scope="row">
                          <Avatar
                            alt="alternative text"
                            size="xs"
                            src={item.avatarUrl}
                            variant="circle"
                          />
                        </th>
                        <td>
                          {item.type === "user" && item.username}
                          {item.type === "group" && item.name}
                        </td>
                        {actions.map((action) => (
                          <td
                            key={action.displayName}
                            style={{ width: "80px" }}
                            className="text-center"
                          >
                            <Checkbox
                              checked={item.actions[action.displayName]}
                              onChange={(e) =>
                                handleActionCheckbox(item, action.displayName)
                              }
                            />
                          </td>
                        ))}
                        <td>
                          <IconButton
                            aria-label="Delete"
                            color="tertiary"
                            icon={<Close />}
                            type="button"
                            variant="ghost"
                            title="Delete"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-16">
                <Button
                  color="tertiary"
                  leftIcon={<Bookmark />}
                  rightIcon={
                    <RafterDown
                      title="Show"
                      className="w-16 min-w-0"
                      style={{
                        transition: "rotate 0.2s ease-out",
                        rotate: showBookmarkInput ? "-180deg" : "0deg",
                      }}
                    />
                  }
                  type="button"
                  variant="ghost"
                  className="fw-normal"
                  onClick={() => toggleBookmarkInput(!showBookmarkInput)}
                >
                  Enregistrer comme favori de partage
                </Button>
                {showBookmarkInput && (
                  <div className="mt-16">
                    <FormControl
                      id="bookmarkName"
                      className="d-flex flex-wrap align-items-center gap-16"
                    >
                      <div className="flex-fill">
                        <FormControl.Input
                          placeholder="Saisir le nom du favori"
                          size="sm"
                          type="text"
                        />
                      </div>
                      <Button
                        type="button"
                        color="primary"
                        variant="ghost"
                        leftIcon={<Save />}
                        className="text-nowrap"
                      >
                        Enregistrer favori
                      </Button>
                    </FormControl>
                  </div>
                )}
              </div>

              <hr />

              <Heading headingStyle="h4" level="h3" className="mb-16 d-flex">
                Rechercher des utilisateurs <InfoCircle className="ms-8" />
              </Heading>

              <FormControl className="input-group max-w-512" id="search">
                <Input
                  noValidationIcon
                  placeholder="nom d’utilisateurs, groupes, favoris"
                  size="md"
                  type="search"
                />
                <SearchButton
                  aria-label="search"
                  icon={<Search />}
                  type="submit"
                />
              </FormControl>

              <hr />

              <Heading headingStyle="h4" level="h3" className="mb-16">
                Circuit de publication des billets
              </Heading>

              <Radio
                label="Publication immédiate"
                id="publication-now"
                name="publication"
                value="now"
                model={radioPublicationValue}
                onChange={handleRadioPublicationChange}
              />
              <Radio
                label="Billets soumis à validation"
                id="publication-validate"
                name="publication"
                value="validate"
                model={radioPublicationValue}
                onChange={handleRadioPublicationChange}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Annuler
              </Button>

              <Button
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Partager
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    scrollable: false,
  },
};

export const PublishOnLibrary = {
  render: (
    args: JSX.IntrinsicAttributes & ModalProps & RefAttributes<HTMLDivElement>,
  ) => {
    const [isOpen, toggle] = useToggle(false);

    const [activityType, setActivityType] = useState();
    const [subjectArea, setSubjectArea] = useState();
    const [language, setLanguage] = useState();
    const [ageMin, setAgeMin] = useState();
    const [ageMax, setAgeMax] = useState();

    const activityTypesOptions: OptionsType[] = [
      { value: "classroomActivity", label: "Activité en classe" },
      { value: "groupActivity", label: "Activité en groupe" },
      { value: "personalActivity", label: "Activité individuelle" },
      { value: "homework", label: "Activité à la maison" },
      { value: "exercize", label: "Exercice" },
      { value: "learningPath", label: "Parcours pédagogique" },
      { value: "courseElement", label: "Élément de cours" },
    ];

    const languageOptions: OptionsType[] = [
      { value: "german", label: "Allemand" },
      { value: "english", label: "Anglais" },
      { value: "arabian", label: "Arabe" },
      { value: "spanish", label: "Espagnol" },
      { value: "french", label: "Français" },
      { value: "italian", label: "Italien" },
      { value: "japanese", label: "Japonais" },
      { value: "mandarinChinese", label: "Mandarin" },
      { value: "portuguese", label: "Portuguais" },
      { value: "russian", label: "Russe" },
    ];

    const subjectAreaOptions: OptionsType[] = [
      { value: "artActivity", label: "Activités artistiques" },
      { value: "readLearning", label: "Apprentissage de la lecture" },
      { value: "chemistry", label: "Chimie" },
      { value: "law", label: "Droit" },
      { value: "worldDiscovery", label: "Découverte du monde" },
      { value: "economy", label: "Economie" },
      { value: "mediaEducation", label: "Education aux médias" },
      { value: "musicEducation", label: "Education musicale" },
      { value: "sportEducation", label: "Education physique et sportive" },
      { value: "citizenshipEducation", label: "Enseignement civique" },
      { value: "geography", label: "Géographie" },
      { value: "history", label: "Histoire" },
      { value: "artHistory", label: "Histoire des arts" },
      { value: "ComputerScience", label: "Informatique" },
      { value: "languages", label: "Langues" },
      { value: "ancientLanguages", label: "Langues anciennes" },
      { value: "literature", label: "Littérature" },
      { value: "mathematics", label: "Mathématiques" },
      { value: "vocationalGuidance", label: "Orientation" },
      { value: "philosohppy", label: "Philosophie" },
      { value: "physics", label: "Physique" },
      { value: "politicalSscience", label: "Sciences politiques" },
      { value: "sociology", label: "Sociologie" },
      { value: "biology", label: "SVT - Biologie" },
      { value: "geology", label: "SVT - Géologie" },
      { value: "technology", label: "Technologie" },
      { value: "german", label: "Allemand" },
      { value: "english", label: "Anglais" },
      { value: "arabian", label: "Arabe" },
      { value: "spanish", label: "Espagnol" },
      { value: "french", label: "Français" },
      { value: "frensh", label: "Français" },
      { value: "italian", label: "Italien" },
      { value: "japanese", label: "Japonais" },
      { value: "mandarinChinese", label: "Mandarin" },
      { value: "portuguese", label: "Portuguais" },
      { value: "russian", label: "Russe" },
    ];

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          Publier dans la bibliothèque
        </Button>
        {isOpen && (
          <Modal
            {...args}
            size="lg"
            isOpen={isOpen}
            onModalClose={handleCloseModal}
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Publier dans la Bibliothèque
            </Modal.Header>

            <Modal.Subtitle>
              La Bilbiothèque est un espace de partage d’activités et de
              ressources mutualisées entre enseignants.
            </Modal.Subtitle>

            <Modal.Body>
              <Heading headingStyle="h4" level="h3" className="mb-16">
                Général
              </Heading>

              <div className="d-md-flex mb-24 gap-24">
                <div style={{ maxWidth: "160px" }}>
                  <div className="form-label">Image d'illustration</div>
                  <ImagePicker
                    app={{
                      address: "/blog",
                      icon: "blog-large",
                      name: "Blog",
                      scope: [],
                      display: false,
                      displayName: "",
                      isExternal: false,
                    }}
                    label="Upload an image"
                    addButtonLabel="Add image"
                    deleteButtonLabel="Delete image"
                    onUploadImage={() => {}}
                    onDeleteImage={() => {}}
                    className="align-self-center"
                  />
                </div>
                <div className="flex-fill">
                  <FormControl id="title" className="mb-16">
                    <Label>Titre</Label>
                    <Input
                      type="text"
                      placeholder="Nom de la ressource"
                      size="md"
                      aria-required={true}
                    />
                  </FormControl>
                  <FormControl id="description">
                    <Label>Description et contexte pédagogique</Label>
                    <Input
                      type="text"
                      placeholder="Description de la ressource"
                      size="md"
                      aria-required={true}
                    />
                  </FormControl>
                </div>
              </div>

              <hr />

              <Heading headingStyle="h4" level="h3" className="mb-16">
                Informations sur le contenu
              </Heading>

              <div className="row mb-24">
                <div className="col">
                  <FormControl id="activityType">
                    <Label>Type</Label>
                    <Select
                      options={activityTypesOptions}
                      model={activityType}
                      placeholderOption="Sélectionner"
                    />
                  </FormControl>
                </div>
                <div className="col">
                  <FormControl id="subjectArea">
                    <Label>Discipline</Label>
                    <Select
                      options={subjectAreaOptions}
                      model={subjectArea}
                      placeholderOption="Sélectionner"
                    />
                  </FormControl>
                </div>
                <div className="col">
                  <FormControl id="language">
                    <Label>Langue</Label>
                    <Select
                      options={languageOptions}
                      model={language}
                      placeholderOption="Sélectionner"
                    />
                  </FormControl>
                </div>
              </div>

              <div className="mb-24">
                <label htmlFor="" className="form-label">
                  Âge conseillé des élèves
                </label>
                <div className="d-flex">
                  <div className="me-16">
                    <FormControl id="ageMin">
                      <Select
                        defaultValue="Age min."
                        options={[
                          3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                          18,
                        ]}
                        model={ageMin}
                        placeholderOption="Age min."
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl id="ageMax">
                      <Select
                        defaultValue="Age max."
                        options={[
                          3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                          18,
                        ]}
                        model={ageMax}
                        placeholderOption="Age max."
                      />
                    </FormControl>
                  </div>
                </div>
              </div>

              <div className="mb-24">
                <FormControl id="keywords" isOptional>
                  <Label>Mots-clefs (5 max), séparés par des virgules</Label>
                  <Input type="text" size="md" placeholder="Mots clés" />
                </FormControl>
              </div>

              <hr />

              <Heading headingStyle="h4" level="h3" className="mb-16">
                En cliquant sur publier
              </Heading>

              <ul className="mb-12">
                <li>
                  J'accepte que mon activité soit publiée sous licence Creative
                  Commons
                  <img
                    className="ms-8 d-inline-block"
                    src="/assets/creative-commons.png"
                    alt="Icone licence Creative
                    Commons"
                  />
                </li>
                <li>
                  J'accepte d'être cité en tant qu'auteur, que le nom de mon
                  établissement soit affiché ainsi qu'un aperçu de mon avatar.
                  Cela permettra aux enseignants de la communauté d'échanger
                  plus facilement avec vous de manière bienveillante !
                </li>
              </ul>

              <Alert type="info" className="mb-12">
                Si votre contenu comporte des commentaires, ceux-ci ne seront
                pas publiés dans la Bibliothèque.
              </Alert>

              <Alert type="warning">
                Les billets actuellement en brouillon et les billets ajoutés
                après la publication du Blog dans la Bibliothèque ne seront pas
                visibles.
              </Alert>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Annuler
              </Button>

              <Button
                type="button"
                color="primary"
                variant="filled"
                onClick={handleCloseModal}
              >
                Accepter et publier
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
  args: {
    scrollable: false,
  },
};

export const OnBoardingTrash = {
  render: (
    args: JSX.IntrinsicAttributes & ModalProps & RefAttributes<HTMLDivElement>,
  ) => {
    const [isOpen, toggle] = useToggle(false);
    const [swiperInstance, setSwiperInstance] = useState<any>();
    const [swiperProgress, setSwiperprogress] = useState<number>(0);

    function handleOpenModal() {
      toggle(true);
    }

    function handleCloseModal() {
      toggle(false);
    }

    return (
      <>
        <Button
          type="button"
          variant="filled"
          color="primary"
          onClick={handleOpenModal}
        >
          On Boarding recycle bin
        </Button>
        {isOpen && (
          <Modal
            {...args}
            size="md"
            isOpen={isOpen}
            onModalClose={handleCloseModal}
          >
            <Modal.Header onModalClose={handleCloseModal}>
              Du nouveau dans la corbeille !
            </Modal.Header>

            <Modal.Body>
              <Swiper
                modules={[Pagination]}
                onSwiper={(swiper) => {
                  setSwiperInstance(swiper);
                }}
                onSlideChange={(swiper) => {
                  setSwiperprogress(swiper.progress);
                }}
                pagination={{
                  clickable: true,
                }}
              >
                <SwiperSlide>
                  <div className="d-flex gap-24 flex-column justify-content-center align-items-stretch">
                    <p>
                      Votre corbeille évolue pour vous permettre de mieux gérer
                      votre espace.
                    </p>
                    <div className="mx-auto">
                      <img
                        src={`assets/themes/ode-bootstrap/images/onboarding/corbeille-notif.svg`}
                        alt=""
                      />
                    </div>
                    <p>
                      Les contenus placés dans la corbeille ne génèrent plus de
                      notifications et n’apparaitront plus dans votre fil
                      d’actualités{" "}
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="d-flex gap-24 flex-column justify-content-center align-items-stretch">
                    <p>
                      Vous pouvez maintenant supprimer les contenus que l’on
                      vous a partagé qui ne vous intéressent plus !
                    </p>
                    <div className="mx-auto">
                      <img
                        src={`assets/themes/ode-bootstrap/images/onboarding/corbeille-delete.svg`}
                        alt=""
                      />
                    </div>
                    <p>
                      Les contenus que l’on vous a partagés et que vous avez
                      placés dans votre corbeille disparaitront de votre espace
                      en fin d’année scolaire
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                color="tertiary"
                variant="ghost"
                onClick={handleCloseModal}
              >
                Plus tard
              </Button>

              {swiperProgress > 0 && (
                <Button
                  type="button"
                  color="primary"
                  variant="outline"
                  onClick={() => swiperInstance.slidePrev()}
                >
                  Précédent
                </Button>
              )}
              {swiperProgress < 1 && (
                <Button
                  type="button"
                  color="primary"
                  variant="filled"
                  onClick={() => swiperInstance.slideNext()}
                >
                  Suivant
                </Button>
              )}
              {swiperProgress === 1 && (
                <Button
                  type="button"
                  color="primary"
                  variant="filled"
                  onClick={handleCloseModal}
                >
                  Fermer
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  },
};
